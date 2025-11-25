import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeSecretKey) {
  console.error('[Cancel Subscription] STRIPE_SECRET_KEY is missing');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Cancel Subscription] Supabase not configured');
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Récupérer l'utilisateur et son subscription_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('[Cancel Subscription] User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!userData.stripe_subscription_id) {
      console.error('[Cancel Subscription] No subscription found for user:', userId);
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Annuler l'abonnement dans Stripe (à la fin de la période)
    const subscription = await stripe.subscriptions.update(
      userData.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    );

    console.log('[Cancel Subscription] Subscription set to cancel at period end:', {
      subscriptionId: subscription.id,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    });

    // Note: On ne change pas le statut immédiatement car l'utilisateur garde l'accès jusqu'à la fin
    // Le webhook customer.subscription.deleted mettra à jour le statut quand l'abonnement sera vraiment annulé

    return res.status(200).json({ 
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });
  } catch (error: any) {
    console.error('[Cancel Subscription] Error:', error);
    return res.status(500).json({ 
      error: 'Failed to cancel subscription',
      message: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

