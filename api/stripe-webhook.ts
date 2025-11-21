import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const isTestMode = stripeSecretKey.startsWith('sk_test_');

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Token amounts for each pack (works with both test and live Price IDs)
// Add your test Price IDs here when you create them in Stripe
const TOKEN_AMOUNTS: Record<string, number> = {
  // LIVE Price IDs
  'price_1STdsSQ95ijGuOd86o9Kz6Xn': 100, // Token Pack (Live)
  'price_1STdtvQ95ijGuOd8hnKkQEE5': 1200, // Premium Token Pack (Live)
  // TEST Price IDs - Add these when you create test prices in Stripe
  // Example: 'price_test_token_pack': 100,
  // Example: 'price_test_premium_tokens': 1200,
};

// Plan ID to subscription status mapping (works with both test and live Price IDs)
const PRICE_TO_SUBSCRIPTION_STATUS: Record<string, 'pro_monthly' | 'pro_annual'> = {
  // LIVE Price IDs
  'price_1STdvsQ95ijGuOd8DTnBtkkE': 'pro_monthly',
  'price_1STdyaQ95ijGuOd8OjQauruf': 'pro_annual',
  // TEST Price IDs - Add these when you create test prices in Stripe
  // Example: 'price_test_pro_monthly': 'pro_monthly',
  // Example: 'price_test_pro_annual': 'pro_annual',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[Stripe Webhook] Missing signature or webhook secret');
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  let event: Stripe.Event;

  try {
    // Get raw body for webhook signature verification
    // In Vercel with bodyParser: false, req.body is a Buffer
    const rawBody = Buffer.isBuffer(req.body) 
      ? req.body.toString('utf8')
      : typeof req.body === 'string' 
      ? req.body 
      : JSON.stringify(req.body);
    
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe Webhook] Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Stripe Webhook] Supabase not configured');
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Log mode for debugging
  if (isTestMode) {
    console.log('[Stripe Webhook] Running in TEST mode');
  } else {
    console.log('[Stripe Webhook] Running in LIVE mode');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId) {
          console.error('[Stripe Webhook] No userId in checkout session');
          return res.status(400).json({ error: 'No userId in checkout session' });
        }

        // Get or create Stripe customer
        let customerId = session.customer as string;
        if (customerId && typeof customerId === 'string') {
          // Update user with Stripe customer ID
          await supabase
            .from('users')
            .update({ stripe_customer_id: customerId })
            .eq('id', userId);
        }

        // Get price ID from session - try line_items first, then expand if needed
        let priceId: string | undefined;
        
        if (session.line_items?.data && session.line_items.data.length > 0) {
          priceId = session.line_items.data[0]?.price?.id;
        } else {
          // If line_items not expanded, retrieve the session with expanded line_items
          const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items'],
          });
          priceId = expandedSession.line_items?.data[0]?.price?.id;
        }
        
        if (!priceId) {
          console.error('[Stripe Webhook] No price ID in checkout session');
          return res.status(400).json({ error: 'No price ID in checkout session' });
        }

        // Handle token packs (one-time payments)
        if (TOKEN_AMOUNTS[priceId]) {
          const tokensToAdd = TOKEN_AMOUNTS[priceId];
          
          // Add tokens to user account
          const { error: tokenError } = await supabase.rpc('increment_tokens', {
            user_id: userId,
            tokens_to_add: tokensToAdd,
          });

          if (tokenError) {
            console.error('[Stripe Webhook] Error adding tokens:', tokenError);
            // Don't fail the webhook, just log the error
          } else {
            console.log(`[Stripe Webhook] Added ${tokensToAdd} tokens to user ${userId}`);
          }
        }

        // Handle subscription plans
        if (PRICE_TO_SUBSCRIPTION_STATUS[priceId]) {
          const subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId];
          
          // Update user subscription status
          const { error: subError } = await supabase
            .from('users')
            .update({ subscription_status: subscriptionStatus })
            .eq('id', userId);

          if (subError) {
            console.error('[Stripe Webhook] Error updating subscription status:', subError);
          } else {
            console.log(`[Stripe Webhook] Updated subscription status to ${subscriptionStatus} for user ${userId}`);
          }
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;

        if (!priceId || !PRICE_TO_SUBSCRIPTION_STATUS[priceId]) {
          break;
        }

        // Find user by Stripe customer ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userError || !userData) {
          console.error('[Stripe Webhook] User not found for customer:', customerId);
          break;
        }

        const subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId];
        
        // Update subscription status
        const { error: subError } = await supabase
          .from('users')
          .update({ 
            subscription_status: subscriptionStatus,
            stripe_subscription_id: subscription.id,
          })
          .eq('id', userData.id);

        if (subError) {
          console.error('[Stripe Webhook] Error updating subscription:', subError);
        } else {
          console.log(`[Stripe Webhook] Updated subscription to ${subscriptionStatus} for user ${userData.id}`);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userError || !userData) {
          console.error('[Stripe Webhook] User not found for customer:', customerId);
          break;
        }

        // Set subscription status to free
        const { error: subError } = await supabase
          .from('users')
          .update({ 
            subscription_status: 'free',
            stripe_subscription_id: null,
          })
          .eq('id', userData.id);

        if (subError) {
          console.error('[Stripe Webhook] Error canceling subscription:', subError);
        } else {
          console.log(`[Stripe Webhook] Canceled subscription for user ${userData.id}`);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) {
          // This is a one-time payment, already handled by checkout.session.completed
          break;
        }

        // Get subscription to find the user
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userError || !userData) {
          console.error('[Stripe Webhook] User not found for customer:', customerId);
          break;
        }

        // Subscription payment succeeded - ensure status is still active
        const priceId = subscription.items.data[0]?.price.id;
        if (priceId && PRICE_TO_SUBSCRIPTION_STATUS[priceId]) {
          const subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId];
          
          const { error: subError } = await supabase
            .from('users')
            .update({ subscription_status: subscriptionStatus })
            .eq('id', userData.id);

          if (subError) {
            console.error('[Stripe Webhook] Error updating subscription after payment:', subError);
          }
        }

        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed', message: error.message });
  }
}

