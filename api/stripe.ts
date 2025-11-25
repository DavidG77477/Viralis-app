import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Get Stripe secret key and determine mode
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const isTestMode = stripeSecretKey.startsWith('sk_test_');

// Plan ID to Stripe Price ID mapping - LIVE MODE
const PLAN_TO_PRICE_ID_LIVE: Record<string, string> = {
  'token-pack': 'price_1STdsSQ95ijGuOd86o9Kz6Xn',
  'premium-tokens': 'price_1STdtvQ95ijGuOd8hnKkQEE5',
  'pro-monthly': 'price_1STdvsQ95ijGuOd8DTnBtkkE',
  'pro-annual': 'price_1STdyaQ95ijGuOd8OjQauruf',
};

// Plan ID to Stripe Price ID mapping - TEST MODE
const PLAN_TO_PRICE_ID_TEST: Record<string, string> = {
  'token-pack': 'price_1SXNuYPt6mHWDz2H77mFGPPJ',
  'premium-tokens': 'price_1SXNvGPt6mHWDz2HgoV6VX8Y',
  'pro-monthly': 'price_1SXNw9Pt6mHWDz2H2gH72U3w',
  'pro-annual': 'price_1SXNxXPt6mHWDz2H8rm3Vnwh',
};

// Select Price IDs based on mode
const PLAN_TO_PRICE_ID = isTestMode ? PLAN_TO_PRICE_ID_TEST : PLAN_TO_PRICE_ID_LIVE;

const isSubscriptionPlan = (planId: string): boolean => {
  return planId === 'pro-monthly' || planId === 'pro-annual';
};

// Initialize Stripe only if key is present
let stripe: Stripe | null = null;
if (stripeSecretKey && stripeSecretKey.length > 10) {
  try {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    });
  } catch (error) {
    console.error('[Stripe] Failed to initialize Stripe:', error);
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  if (!stripe) {
    console.error('[Stripe] STRIPE_SECRET_KEY is missing or invalid');
    return res.status(500).json({ 
      error: 'Stripe secret key not configured',
      details: 'Please configure STRIPE_SECRET_KEY in Vercel environment variables'
    });
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Stripe] Supabase not configured');
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    switch (action) {
      case 'create-checkout-session': {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { planId, userId, language: bodyLanguage } = req.body;

        if (!planId || !userId) {
          return res.status(400).json({ error: 'Missing planId or userId' });
        }

        if (!PLAN_TO_PRICE_ID[planId]) {
          console.error('[Stripe] Invalid planId:', planId);
          return res.status(400).json({ error: `Invalid planId: ${planId}` });
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
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('id', userId)
          .single();

        if (!userError && userData) {
          customerEmail = userData.email;
        }

        const priceId = PLAN_TO_PRICE_ID[planId];
        const isSubscription = isSubscriptionPlan(planId);

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

        // Get language preference from request (if provided)
        const language = bodyLanguage || req.query.language || 'en';
        // Map app language to Stripe locale
        // Stripe supports: 'auto', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'es-419', 'et', 'fi', 'fr', 'fr-CA', 'he', 'hu', 'id', 'it', 'ja', 'lt', 'lv', 'ms', 'mt', 'nb', 'nl', 'pl', 'pt', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'zh', 'zh-HK', 'zh-TW'
        const stripeLocale: Stripe.Checkout.SessionCreateParams.Locale = 
          language === 'fr' ? 'fr' : 
          language === 'es' ? 'es' : 
          'en';

        console.log('[Stripe] Language preference:', { 
          bodyLanguage, 
          queryLanguage: req.query.language, 
          finalLanguage: language, 
          stripeLocale 
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
          expand: ['line_items'],
          locale: stripeLocale, // Force Stripe Checkout language (overrides browser language)
        };

        if (customerEmail) {
          sessionParams.customer_email = customerEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return res.status(200).json({
          url: session.url,
          sessionId: session.id,
        });
      }

      case 'create-portal-session': {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ error: 'Missing userId' });
        }

        // Get user's Stripe customer ID from Supabase
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('stripe_customer_id')
          .eq('id', userId)
          .single();

        if (userError || !userData?.stripe_customer_id) {
          return res.status(400).json({ error: 'User not found or no Stripe customer ID' });
        }

        // Get language preference from request (if provided)
        const language = req.body.language || req.query.language || 'en';
        const stripeLocale: Stripe.BillingPortal.SessionCreateParams.Locale = 
          language === 'fr' ? 'fr' : 
          language === 'es' ? 'es' : 
          'en';

        // Get base URL for return URL
        const baseUrl = req.headers.origin || 
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000');

        // Create portal session
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: userData.stripe_customer_id,
          return_url: `${baseUrl}/dashboard`,
          locale: stripeLocale, // Set Stripe Portal language
        });

        return res.status(200).json({
          url: portalSession.url,
        });
      }

      case 'get-subscription-status': {
        if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
          return res.status(400).json({ error: 'Missing or invalid userId' });
        }

        // Get user's Stripe customer ID from Supabase
        let customerId: string | null = null;
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('stripe_customer_id')
          .eq('id', userId)
          .single();

        if (!userError && userData?.stripe_customer_id) {
          customerId = userData.stripe_customer_id;
        }

        if (!customerId) {
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

        // Map price ID to plan type (support both test and live)
        let planType: 'pro_monthly' | 'pro_annual' | null = null;
        const proMonthlyPriceIds = [
          'price_1STdvsQ95ijGuOd8DTnBtkkE', // Live
          'price_1SXNw9Pt6mHWDz2H2gH72U3w', // Test
        ];
        const proAnnualPriceIds = [
          'price_1STdyaQ95ijGuOd8OjQauruf', // Live
          'price_1SXNxXPt6mHWDz2H8rm3Vnwh', // Test
        ];
        
        if (proMonthlyPriceIds.includes(priceId)) {
          planType = 'pro_monthly';
        } else if (proAnnualPriceIds.includes(priceId)) {
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
      }

      case 'cancel-subscription': {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { userId } = req.body;

        console.log('[Stripe] Cancel subscription request:', { userId });

        if (!userId) {
          return res.status(400).json({ error: 'Missing userId' });
        }

        // Récupérer l'utilisateur et son subscription_id
        let { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, stripe_customer_id, stripe_subscription_id')
          .eq('id', userId)
          .single();

        // Si l'utilisateur n'existe pas, essayer de le créer
        if (userError && userError.code === 'PGRST116') {
          console.warn('[Stripe] User profile not found, attempting to create it');
          
          // Utiliser RPC ou SQL direct pour créer le profil depuis auth.users
          // Note: On ne peut pas accéder directement à auth.users via PostgREST
          // Le trigger handle_new_user devrait créer le profil, mais s'il n'existe pas,
          // on doit le créer manuellement avec les infos disponibles
          
          // Essayer de créer un profil minimal
          const { data: newUserData, error: createError } = await supabase
            .from('users')
            .insert({
              id: userId,
              email: `user-${userId.substring(0, 8)}@temp.com`, // Email temporaire
              name: 'User',
              provider: 'email',
              tokens: 30,
            })
            .select('id, stripe_customer_id, stripe_subscription_id')
            .single();

          if (createError || !newUserData) {
            console.error('[Stripe] Failed to create user profile:', createError);
            return res.status(404).json({ 
              error: 'User profile not found',
              details: 'Your user profile does not exist. Please refresh the page or contact support.',
              suggestion: 'Try refreshing the page to create your profile automatically'
            });
          }

          userData = newUserData;
          console.log('[Stripe] User profile created automatically:', { userId: userData.id });
        } else if (userError) {
          console.error('[Stripe] Error fetching user:', userError);
          console.error('[Stripe] Error code:', userError.code);
          console.error('[Stripe] Error message:', userError.message);
          return res.status(404).json({ 
            error: 'User not found',
            details: userError.message || 'User does not exist in database'
          });
        }

        if (!userData) {
          console.error('[Stripe] User data is null for userId:', userId);
          return res.status(404).json({ error: 'User not found' });
        }

        console.log('[Stripe] User found:', {
          userId: userData.id,
          hasStripeCustomerId: !!userData.stripe_customer_id,
          hasStripeSubscriptionId: !!userData.stripe_subscription_id,
        });

        if (!userData.stripe_subscription_id) {
          console.error('[Stripe] No subscription found for user:', userId);
          return res.status(400).json({ error: 'No active subscription found' });
        }

        // Annuler l'abonnement dans Stripe (à la fin de la période)
        const subscription = await stripe.subscriptions.update(
          userData.stripe_subscription_id,
          {
            cancel_at_period_end: true,
          }
        );

        console.log('[Stripe] Subscription set to cancel at period end:', {
          subscriptionId: subscription.id,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: (subscription as any).current_period_end 
            ? new Date((subscription as any).current_period_end * 1000).toISOString()
            : null,
        });

        return res.status(200).json({ 
          success: true,
          message: 'Subscription will be cancelled at the end of the billing period',
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: (subscription as any).current_period_end 
            ? new Date((subscription as any).current_period_end * 1000).toISOString()
            : null,
        });
      }

      default:
        return res.status(400).json({ error: 'Invalid action. Use: create-checkout-session, create-portal-session, get-subscription-status, or cancel-subscription' });
    }
  } catch (error: any) {
    console.error('[Stripe] Error:', error);
    console.error('[Stripe] Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
    });
    return res.status(500).json({ 
      error: 'Stripe operation failed',
      message: error.message || 'Unknown error',
      type: error.type || undefined,
      code: error.code || undefined,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

