import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { PLAN_TO_PRICE_ID, isSubscriptionPlan, type PlanId } from '../services/stripeService';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const isTestMode = stripeSecretKey.startsWith('sk_test_');

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, userId } = req.body;

    if (!planId || !userId) {
      return res.status(400).json({ error: 'Missing planId or userId' });
    }

    if (!PLAN_TO_PRICE_ID[planId as PlanId]) {
      return res.status(400).json({ error: 'Invalid planId' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[Stripe] STRIPE_SECRET_KEY is missing');
      return res.status(500).json({ error: 'Stripe secret key not configured' });
    }

    if (!stripeSecretKey || stripeSecretKey.length < 10) {
      console.error('[Stripe] STRIPE_SECRET_KEY appears to be invalid');
      return res.status(500).json({ error: 'Stripe secret key appears to be invalid' });
    }

    // Log mode for debugging
    if (isTestMode) {
      console.log('[Stripe] Running in TEST mode');
    } else if (stripeSecretKey.startsWith('sk_live_')) {
      console.log('[Stripe] Running in LIVE mode');
    } else {
      console.warn('[Stripe] Unknown key format, may cause errors');
    }

    // Get user email from Supabase
    let customerEmail: string | undefined;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (!userError && userData) {
        customerEmail = userData.email;
      }
    }

    const priceId = PLAN_TO_PRICE_ID[planId as PlanId];
    if (!priceId) {
      console.error('[Stripe] Invalid planId:', planId);
      return res.status(400).json({ error: `Invalid planId: ${planId}` });
    }

    const isSubscription = isSubscriptionPlan(planId as PlanId);

    // Get base URL for success/cancel URLs
    const baseUrl = req.headers.origin || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000');
    
    console.log('[Stripe] Creating checkout session:', {
      planId,
      priceId,
      isSubscription,
      baseUrl,
      userId,
    });

    // Create Stripe Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=${planId}`,
      cancel_url: `${baseUrl}/cancel`,
      client_reference_id: userId,
      metadata: {
        planId: planId,
        userId: userId,
      },
      // Expand line_items for webhook processing
      expand: ['line_items'],
    };

    // Add customer email if available
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('[Stripe] Error creating checkout session:', error);
    console.error('[Stripe] Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      raw: error.raw,
    });
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

