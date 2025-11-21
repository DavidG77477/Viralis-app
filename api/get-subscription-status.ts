import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid userId' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe secret key not configured' });
    }

    // Get user's Stripe customer ID from Supabase
    let customerId: string | null = null;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (!userError && userData?.stripe_customer_id) {
        customerId = userData.stripe_customer_id;
      }
    }

    if (!customerId) {
      // No customer ID means no subscription
      return res.status(200).json({
        status: null,
        planType: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }

    // Get active subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return res.status(200).json({
        status: null,
        planType: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0]?.price.id;

    // Map price ID to plan type
    let planType: 'pro_monthly' | 'pro_annual' | null = null;
    if (priceId === 'price_1STdvsQ95ijGuOd8DTnBtkkE') {
      planType = 'pro_monthly';
    } else if (priceId === 'price_1STdyaQ95ijGuOd8OjQauruf') {
      planType = 'pro_annual';
    }

    return res.status(200).json({
      status: subscription.status as 'active' | 'canceled' | 'past_due' | 'unpaid' | null,
      planType,
      currentPeriodEnd: (subscription as any).current_period_end 
        ? new Date((subscription as any).current_period_end * 1000).toISOString() 
        : null,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
    });
  } catch (error: any) {
    console.error('[Stripe] Error getting subscription status:', error);
    return res.status(500).json({ 
      error: 'Failed to get subscription status',
      message: error.message 
    });
  }
}

