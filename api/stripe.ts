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

// Price ID to subscription status mapping (LIVE + TEST MODE)
const PRICE_TO_SUBSCRIPTION_STATUS: Record<string, 'pro_monthly' | 'pro_annual'> = {
  // Live mode
  'price_1STdvsQ95ijGuOd8DTnBtkkE': 'pro_monthly',
  'price_1STdyaQ95ijGuOd8OjQauruf': 'pro_annual',
  // Test mode
  'price_1SXNw9Pt6mHWDz2H2gH72U3w': 'pro_monthly',
  'price_1SXNxXPt6mHWDz2H8rm3Vnwh': 'pro_annual',
};

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

        // Get subscriptions from Stripe (including canceled ones)
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all',
          limit: 10, // Get more to find canceled subscriptions
        });

        if (subscriptions.data.length === 0) {
          console.log('[Stripe] No subscriptions found for customer:', customerId);
          return res.status(200).json({
            status: null,
            planType: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            canceledAt: null,
            canceledDate: null,
          });
        }

        // Prefer active subscription, but also check canceled ones
        let subscription = subscriptions.data.find(sub => sub.status === 'active' || sub.status === 'trialing');
        if (!subscription) {
          // If no active, get the most recent canceled subscription
          subscription = subscriptions.data.find(sub => sub.status === 'canceled');
        }
        if (!subscription) {
          // Fallback to first subscription
          subscription = subscriptions.data[0];
        }

        const priceId = subscription.items.data[0]?.price.id;
        console.log('[Stripe] Found subscription:', {
          id: subscription.id,
          status: subscription.status,
          priceId: priceId,
          current_period_end: (subscription as any).current_period_end || 'not in list response',
        });

        // Si c'est un abonnement annulé et que current_period_end n'est pas dans la liste,
        // récupérer la subscription complète depuis Stripe (elle contient toujours current_period_end)
        let currentPeriodEnd = (subscription as any).current_period_end;
        if (subscription.status === 'canceled' && !currentPeriodEnd) {
          console.log('[Stripe] current_period_end not in list response, retrieving full subscription from Stripe...');
          try {
            const fullSubscription = await stripe.subscriptions.retrieve(subscription.id);
            currentPeriodEnd = (fullSubscription as any).current_period_end;
            console.log('[Stripe] Retrieved full subscription, current_period_end:', currentPeriodEnd);
            // Mettre à jour l'objet subscription avec les données complètes
            subscription = fullSubscription as any;
          } catch (retrieveError) {
            console.error('[Stripe] Error retrieving full subscription:', retrieveError);
          }
        }

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
          console.log('[Stripe] Detected plan type: pro_monthly');
        } else if (proAnnualPriceIds.includes(priceId)) {
          planType = 'pro_annual';
          console.log('[Stripe] Detected plan type: pro_annual');
        } else {
          console.warn('[Stripe] Unknown price ID:', priceId);
        }

        const subscriptionStatus = subscription.status as 'active' | 'canceled' | 'past_due' | 'unpaid' | null;
        const canceledAt = (subscription as any).canceled_at 
          ? new Date((subscription as any).canceled_at * 1000).toISOString() 
          : null;
        
        // Convertir currentPeriodEnd en ISO string si disponible
        let currentPeriodEndISO = currentPeriodEnd 
          ? new Date(currentPeriodEnd * 1000).toISOString() 
          : null;
        
        // Pour les abonnements annulés, calculer la date de fin d'accès comme : date d'annulation + 1 mois (ou 1 an)
        // C'est différent de current_period_end qui représente la fin de la période de facturation
        if (subscriptionStatus === 'canceled' && canceledAt && planType) {
          const canceledDate = new Date(canceledAt);
          const accessEndDate = new Date(canceledDate);
          
          // Calculer la date de fin d'accès : date d'annulation + période
          if (planType === 'pro_monthly') {
            accessEndDate.setMonth(accessEndDate.getMonth() + 1);
            console.log('[Stripe] Calculated access end date for monthly: canceled_at + 1 month');
          } else if (planType === 'pro_annual') {
            accessEndDate.setFullYear(accessEndDate.getFullYear() + 1);
            console.log('[Stripe] Calculated access end date for annual: canceled_at + 1 year');
          }
          
          // Utiliser cette date calculée comme currentPeriodEnd pour l'affichage
          currentPeriodEndISO = accessEndDate.toISOString();
          console.log('[Stripe] Access end date (canceled_at + period):', currentPeriodEndISO);
        } else if (subscriptionStatus === 'canceled' && !currentPeriodEndISO && planType) {
          // Fallback si canceledAt n'est pas disponible
          console.log('[Stripe] current_period_end not available for canceled subscription, trying to get from last invoice...');
          
          try {
            // Essayer de récupérer la dernière invoice pour obtenir la période de facturation
            const invoices = await stripe.invoices.list({
              customer: customerId,
              subscription: subscription.id,
              limit: 1,
            });
            
            if (invoices.data.length > 0) {
              const lastInvoice = invoices.data[0];
              // Si l'invoice a une période de facturation, l'utiliser
              if ((lastInvoice as any).period_end) {
                currentPeriodEndISO = new Date((lastInvoice as any).period_end * 1000).toISOString();
                console.log('[Stripe] Found current_period_end from last invoice:', currentPeriodEndISO);
              }
            }
          } catch (invoiceError) {
            console.warn('[Stripe] Could not get current_period_end from invoice:', invoiceError);
          }
        }
        
        console.log('[Stripe] Final subscription data:', {
          status: subscriptionStatus,
          planType,
          currentPeriodEnd: currentPeriodEndISO,
          canceledAt,
        });

        return res.status(200).json({
          status: subscriptionStatus,
          planType,
          currentPeriodEnd: currentPeriodEndISO,
          cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
          canceledAt,
          canceledDate: canceledAt || null, // Return ISO string, frontend will format based on language
        });
      }

      case 'cancel-subscription': {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { userId, userEmail } = req.body;

        console.log('[Stripe] Cancel subscription request:', { userId, userEmail });

        if (!userId) {
          return res.status(400).json({ error: 'Missing userId' });
        }

        // Helper function to find user by ID or email
        const findUser = async (): Promise<{ id: string; email: string | null; stripe_customer_id: string | null; stripe_subscription_id: string | null } | null> => {
        // D'abord essayer par ID
        let { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, stripe_customer_id, stripe_subscription_id')
          .eq('id', userId)
          .single();

          if (!userError && userData) {
            console.log('[Stripe] User found by ID:', userData.id);
            return userData;
          }

        // Si pas trouvé par ID et qu'on a un email, essayer par email
        if (userError && userError.code === 'PGRST116' && (userEmail || userId.includes('@'))) {
          const emailToSearch = userEmail || userId;
          console.log('[Stripe] User not found by ID, trying by email:', emailToSearch);
          const { data: userByEmail, error: emailError } = await supabase
            .from('users')
            .select('id, email, stripe_customer_id, stripe_subscription_id')
            .eq('email', emailToSearch)
            .single();
          
          if (!emailError && userByEmail) {
            console.log('[Stripe] User found by email:', userByEmail.id);
              return userByEmail;
            }
          }

          return null;
        };

        // Récupérer l'utilisateur
        let userData = await findUser();
        let userError: any = userData ? null : { code: 'PGRST116', message: 'User not found' };

        // Si l'utilisateur n'existe pas dans users, chercher dans Stripe
        if (!userData && userError && userError.code === 'PGRST116') {
          console.warn('[Stripe] User profile not found, searching in Stripe');
          
          try {
            // 1. Chercher dans les sessions de checkout récentes par client_reference_id
            const sessions = await stripe.checkout.sessions.list({
              limit: 100,
            });

            let foundCustomerId: string | null = null;
            let foundSubscriptionId: string | null = null;
            let customerEmail: string | null = null;

            // Chercher une session avec ce userId comme client_reference_id
            for (const session of sessions.data) {
              if (session.client_reference_id === userId && session.customer) {
                foundCustomerId = session.customer as string;
                foundSubscriptionId = session.subscription as string | null;
                customerEmail = session.customer_email || null;
                break;
              }
            }

            // 2. Si pas trouvé, chercher dans les subscriptions actives
            if (!foundCustomerId) {
              const subscriptions = await stripe.subscriptions.list({
                limit: 100,
                status: 'all',
              });

              // Chercher dans les metadata des sessions ou customers
              for (const sub of subscriptions.data) {
                const customerId = sub.customer as string;
                try {
                  const customer = await stripe.customers.retrieve(customerId);
                  if (customer && typeof customer === 'object' && !customer.deleted) {
                    // Vérifier si on peut trouver une session avec ce customer et ce userId
                    const customerSessions = await stripe.checkout.sessions.list({
                      customer: customerId,
                      limit: 10,
                    });
                    
                    for (const sess of customerSessions.data) {
                      if (sess.client_reference_id === userId) {
                        foundCustomerId = customerId;
                        foundSubscriptionId = sub.id;
                        customerEmail = (customer as any).email || null;
                        break;
                      }
                    }
                    if (foundCustomerId) break;
                  }
                } catch (err) {
                  // Continue searching
                  continue;
                }
              }
            }

            if (foundCustomerId) {
              console.log('[Stripe] Found user in Stripe, creating profile:', {
                userId,
                customerId: foundCustomerId,
                subscriptionId: foundSubscriptionId,
              });

              // Récupérer les infos complètes du customer
              const customer = await stripe.customers.retrieve(foundCustomerId);
              if (customer && typeof customer === 'object' && !customer.deleted) {
                const email = customerEmail || (customer as any).email || `user-${userId.substring(0, 8)}@temp.com`;
                const name = (customer as any).name || email.split('@')[0];

                // Créer ou mettre à jour le profil avec les infos de Stripe
                const { data: newUserData, error: createError } = await supabase
                  .from('users')
                  .upsert({
                    id: userId,
                    email: email,
                    name: name,
                    stripe_customer_id: foundCustomerId,
                    stripe_subscription_id: foundSubscriptionId,
                    provider: 'email',
                    tokens: 30,
                  }, {
                    onConflict: 'id'
                  })
                  .select('id, email, stripe_customer_id, stripe_subscription_id')
                  .single();

                if (createError || !newUserData) {
                  console.error('[Stripe] Failed to create user profile:', createError);
                  return res.status(500).json({ 
                    error: 'Failed to create user profile',
                    details: createError?.message || 'Unknown error'
                  });
                }

                userData = newUserData;
                console.log('[Stripe] User profile created from Stripe data:', { userId: userData.id });
              } else {
                return res.status(404).json({ 
                  error: 'User not found',
                  details: 'Could not retrieve customer information from Stripe'
                });
              }
            } else {
              return res.status(404).json({ 
                error: 'User not found',
                details: 'No Stripe subscription found for this user. Please ensure you have an active subscription.'
              });
            }
          } catch (stripeError: any) {
            console.error('[Stripe] Error searching in Stripe:', stripeError);
            return res.status(500).json({ 
              error: 'Error searching for user in Stripe',
              details: stripeError.message || 'Unknown error'
            });
          }
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
          email: userData.email,
          hasStripeCustomerId: !!userData.stripe_customer_id,
          hasStripeSubscriptionId: !!userData.stripe_subscription_id,
        });

        // Si pas de subscription_id, chercher l'abonnement actif dans Stripe
        let subscriptionId = userData.stripe_subscription_id;
        let foundCustomerId = userData.stripe_customer_id;
        
        if (!subscriptionId) {
          console.log('[Stripe] No subscription_id in database, searching in Stripe...');
          
          try {
            // Méthode 1: Si on a un customer_id, chercher par customer_id
            if (foundCustomerId) {
              console.log('[Stripe] Searching by customer_id:', foundCustomerId);
              const subscriptions = await stripe.subscriptions.list({
                customer: foundCustomerId,
                status: 'active',
                limit: 1,
              });

              if (subscriptions.data.length > 0) {
                subscriptionId = subscriptions.data[0].id;
                console.log('[Stripe] Found active subscription by customer_id:', subscriptionId);
              } else {
                // Chercher aussi les abonnements actifs (même en cours d'annulation)
                const allSubscriptions = await stripe.subscriptions.list({
                  customer: foundCustomerId,
                  status: 'all',
                  limit: 10,
                });

                const activeOrCanceling = allSubscriptions.data.find(
                  sub => sub.status === 'active'
                );

                if (activeOrCanceling) {
                  subscriptionId = activeOrCanceling.id;
                  console.log('[Stripe] Found active subscription (may be canceling):', subscriptionId);
                }
              }
            }
            
            // Méthode 2: Si toujours pas trouvé, chercher par client_reference_id (userId) dans les sessions
            if (!subscriptionId) {
              console.log('[Stripe] Searching by client_reference_id (userId):', userId);
              const sessions = await stripe.checkout.sessions.list({
                limit: 100,
              });

              // Chercher une session avec ce userId comme client_reference_id
              for (const session of sessions.data) {
                if (session.client_reference_id === userId && session.subscription) {
                  const sessionSubscriptionId = session.subscription as string;
                  foundCustomerId = session.customer as string;
                  
                  // Vérifier que l'abonnement est actif
                  try {
                    const subscription = await stripe.subscriptions.retrieve(sessionSubscriptionId);
                    if (subscription.status === 'active') {
                      subscriptionId = sessionSubscriptionId;
                      console.log('[Stripe] Found active subscription by client_reference_id:', subscriptionId);
                      console.log('[Stripe] Found customer_id from session:', foundCustomerId);
                      break;
                    }
                  } catch (err) {
                    // Subscription might be deleted, continue searching
                    continue;
                  }
                }
              }
            }

            // Méthode 3: Si toujours pas trouvé, chercher par email dans les customers
            if (!subscriptionId && userData.email) {
              console.log('[Stripe] Searching by email:', userData.email);
              const customers = await stripe.customers.list({
                email: userData.email,
                limit: 10,
              });

              for (const customer of customers.data) {
                const subscriptions = await stripe.subscriptions.list({
                  customer: customer.id,
                  status: 'active',
                  limit: 1,
                });

                if (subscriptions.data.length > 0) {
                  subscriptionId = subscriptions.data[0].id;
                  foundCustomerId = customer.id;
                  console.log('[Stripe] Found active subscription by email:', subscriptionId);
                  console.log('[Stripe] Found customer_id by email:', foundCustomerId);
                  break;
                }
              }
            }

            // Si on a trouvé un abonnement, mettre à jour l'utilisateur
            if (subscriptionId) {
              const updateData: any = { stripe_subscription_id: subscriptionId };
              if (foundCustomerId && !userData.stripe_customer_id) {
                updateData.stripe_customer_id = foundCustomerId;
              }
              
              await supabase
                .from('users')
                .update(updateData)
                .eq('id', userData.id);
              
              console.log('[Stripe] Updated user with:', updateData);
            }
          } catch (stripeError: any) {
            console.error('[Stripe] Error searching for subscription in Stripe:', stripeError);
          }
        }

        if (!subscriptionId) {
          console.error('[Stripe] ❌ No subscription found for user:', userId);
          console.error('[Stripe] User data:', {
            id: userData?.id,
            email: userData?.email,
            hasStripeCustomerId: !!userData?.stripe_customer_id,
            hasStripeSubscriptionId: !!userData?.stripe_subscription_id,
            stripe_customer_id: userData?.stripe_customer_id || 'NOT SET',
          });
          console.error('[Stripe] Attempted search methods:');
          console.error('  - By stripe_customer_id:', userData?.stripe_customer_id || 'N/A');
          console.error('  - By client_reference_id (userId):', userId);
          console.error('  - By email:', userData?.email || 'N/A');
          
          return res.status(400).json({ 
            error: 'No active subscription found',
            details: 'No active subscription found in Stripe. Please check that your subscription was successfully created. If you just subscribed, please wait a few moments and try again.',
            userEmail: userData?.email || 'Unknown',
            userId: userData?.id,
            debug: {
              hasStripeCustomerId: !!userData?.stripe_customer_id,
              hasStripeSubscriptionId: !!userData?.stripe_subscription_id,
            }
          });
        }

        // Récupérer l'abonnement avant de le modifier pour obtenir le planType et current_period_end
        const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Déterminer le type d'abonnement
        const priceId = currentSubscription.items.data[0]?.price.id;
        const proMonthlyPriceIds = [
          'price_1STdvsQ95ijGuOd8DTnBtkkE', // Live
          'price_1SXNw9Pt6mHWDz2H2gH72U3w', // Test
        ];
        const proAnnualPriceIds = [
          'price_1STdyaQ95ijGuOd8OjQauruf', // Live
          'price_1SXNxXPt6mHWDz2H8rm3Vnwh', // Test
        ];
        
        let planTypeToKeep: 'pro_monthly' | 'pro_annual' | null = null;
        if (proMonthlyPriceIds.includes(priceId)) {
          planTypeToKeep = 'pro_monthly';
        } else if (proAnnualPriceIds.includes(priceId)) {
          planTypeToKeep = 'pro_annual';
        }
        
        console.log('[Stripe] Plan type:', planTypeToKeep);
        
        // Programmer l'annulation à la fin de la période actuelle dans Stripe
        // L'abonnement restera actif jusqu'à current_period_end, mais ne sera pas renouvelé
        const now = Math.floor(Date.now() / 1000);
        let cancelAtTimestamp: number;
        
        if (planTypeToKeep === 'pro_monthly') {
          // Calculer la date d'annulation comme maintenant + 1 mois
          const cancelDate = new Date();
          cancelDate.setMonth(cancelDate.getMonth() + 1);
          cancelAtTimestamp = Math.floor(cancelDate.getTime() / 1000);
        } else if (planTypeToKeep === 'pro_annual') {
          // Calculer la date d'annulation comme maintenant + 1 an
          const cancelDate = new Date();
          cancelDate.setFullYear(cancelDate.getFullYear() + 1);
          cancelAtTimestamp = Math.floor(cancelDate.getTime() / 1000);
        } else {
          // Fallback: utiliser current_period_end si disponible
          cancelAtTimestamp = (currentSubscription as any).current_period_end || now;
        }
        
        // Programmer l'annulation dans Stripe pour la date calculée
        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at: cancelAtTimestamp,
          cancel_at_period_end: false, // On annule à la date spécifique calculée
        });

        console.log('[Stripe] Subscription scheduled for cancellation:', {
          subscriptionId: canceledSubscription.id,
          status: canceledSubscription.status,
          cancelAt: cancelAtTimestamp ? new Date(cancelAtTimestamp * 1000).toISOString() : null,
          cancelAtPeriodEnd: (canceledSubscription as any).cancel_at_period_end,
          current_period_end: (canceledSubscription as any).current_period_end 
            ? new Date((canceledSubscription as any).current_period_end * 1000).toISOString()
            : null,
        });

        // Calculer pro_access_until comme la date d'annulation programmée (déjà calculée comme maintenant + période)
        // Cette date est la même que cancelAtTimestamp puisque nous programmons l'annulation pour cette date
        let proAccessUntil: string | null = null;
        try {
          // Utiliser la date calculée (maintenant + période)
          proAccessUntil = new Date(cancelAtTimestamp * 1000).toISOString();
          console.log('[Stripe] ✅ Pro access until (cancel_at timestamp):', proAccessUntil);
        } catch (err) {
          console.warn('[Stripe] Could not calculate pro_access_until:', err);
        }

        // Mettre à jour le statut dans Supabase
        // On met subscription_status à 'free' mais on garde pro_access_until jusqu'à current_period_end
        const updateData: any = {
          subscription_status: 'free',
          stripe_subscription_id: null,
        };
        
        // Si on a une date de fin d'accès, l'ajouter
        if (proAccessUntil) {
          updateData.pro_access_until = proAccessUntil;
          console.log('[Stripe] ✅ Will update pro_access_until to:', proAccessUntil);
        } else {
          console.warn('[Stripe] ⚠️ No proAccessUntil date available - current_period_end may not be in canceledSubscription');
        }
        
        console.log('[Stripe] Updating user with data:', updateData);
        
        const { error: updateError, data: updatedUser } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userData.id)
          .select('id, email, subscription_status, stripe_subscription_id, pro_access_until')
          .single();

        if (updateError) {
          console.error('[Stripe] ❌ Error updating user status in Supabase:', updateError);
          console.error('[Stripe] Update error details:', JSON.stringify(updateError, null, 2));
        } else if (updatedUser) {
          console.log('[Stripe] ✅ Successfully updated user status in Supabase:', {
            userId: updatedUser.id,
            email: updatedUser.email,
            newStatus: updatedUser.subscription_status,
            stripe_subscription_id: updatedUser.stripe_subscription_id,
            pro_access_until: updatedUser.pro_access_until || 'N/A',
          });
          
          if (!updatedUser.pro_access_until && proAccessUntil) {
            console.error('[Stripe] ⚠️ WARNING: pro_access_until was not saved even though proAccessUntil was provided!');
          }
        } else {
          console.warn('[Stripe] ⚠️ Update succeeded but no data returned');
        }

        // Supprimer le plan de distribution de tokens si existe
        const { error: distDeleteError } = await supabase
          .from('subscription_token_distributions')
          .delete()
          .eq('user_id', userData.id)
          .eq('subscription_id', subscriptionId);

        if (distDeleteError) {
          console.warn('[Stripe] Error deleting token distribution:', distDeleteError);
        } else {
          console.log('[Stripe] ✅ Deleted token distribution schedule');
        }

        return res.status(200).json({ 
          success: true,
          message: `Subscription scheduled for cancellation on ${new Date(cancelAtTimestamp * 1000).toLocaleDateString()}. Access will remain active until then.`,
          status: canceledSubscription.status,
          cancel_at: new Date(cancelAtTimestamp * 1000).toISOString(),
          pro_access_until: proAccessUntil,
        });
      }

      case 'sync-user-subscription': {
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }

        const { userId, userEmail } = req.body;

        console.log('[Stripe] Sync subscription request:', { userId, userEmail });

        if (!userId) {
          return res.status(400).json({ error: 'Missing userId' });
        }

        // Helper function to find user by ID or email
        const findUser = async (): Promise<{ id: string; email: string | null; stripe_customer_id: string | null; stripe_subscription_id: string | null; subscription_status: string | null } | null> => {
          // D'abord essayer par ID
          let { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, stripe_customer_id, stripe_subscription_id, subscription_status')
            .eq('id', userId)
            .single();

          if (!userError && userData) {
            return userData;
          }

          // Si pas trouvé par ID et qu'on a un email, essayer par email
          if (userError && userError.code === 'PGRST116' && (userEmail || userId.includes('@'))) {
            const emailToSearch = userEmail || userId;
            const { data: userByEmail, error: emailError } = await supabase
              .from('users')
              .select('id, email, stripe_customer_id, stripe_subscription_id, subscription_status')
              .eq('email', emailToSearch)
              .single();
            
            if (!emailError && userByEmail) {
              return userByEmail;
            }
          }

          return null;
        };

        // Récupérer l'utilisateur
        let userData = await findUser();

        if (!userData) {
          return res.status(404).json({ error: 'User not found in Supabase' });
        }

        console.log('[Stripe] User found:', {
          userId: userData.id,
          email: userData.email,
          hasStripeCustomerId: !!userData.stripe_customer_id,
          hasStripeSubscriptionId: !!userData.stripe_subscription_id,
        });

        let foundCustomerId = userData.stripe_customer_id;
        let foundSubscriptionId: string | null = null;
        let subscriptionStatus: string | null = null;

        try {
          // Méthode 1: Chercher par customer_id si disponible (actif ou annulé)
          let currentPeriodEnd: string | null = null;
          if (foundCustomerId) {
            console.log('[Stripe] Searching by customer_id:', foundCustomerId);
            const subscriptions = await stripe.subscriptions.list({
              customer: foundCustomerId,
              status: 'all',
              limit: 10,
            });

            // Préférer les abonnements actifs, mais aussi chercher les annulés
            const activeSubscription = subscriptions.data.find(
              sub => sub.status === 'active' || sub.status === 'trialing'
            );
            
            const canceledSubscription = subscriptions.data.find(
              sub => sub.status === 'canceled'
            );

            if (activeSubscription) {
              foundSubscriptionId = activeSubscription.id;
              const priceId = activeSubscription.items.data[0]?.price.id;
              subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId] || null;
              if ((activeSubscription as any).current_period_end) {
                currentPeriodEnd = new Date((activeSubscription as any).current_period_end * 1000).toISOString();
              }
              console.log('[Stripe] Found active subscription by customer_id:', foundSubscriptionId);
            } else if (canceledSubscription) {
              // Même si annulé, on récupère les infos pour mettre à jour pro_access_until
              foundSubscriptionId = canceledSubscription.id;
              const priceId = canceledSubscription.items.data[0]?.price.id;
              subscriptionStatus = 'free'; // Statut à 'free' pour les annulés
              
              // Calculer pro_access_until comme canceled_at + période (1 mois ou 1 an)
              const canceledAtTimestamp = (canceledSubscription as any).canceled_at;
              if (canceledAtTimestamp) {
                const canceledDate = new Date(canceledAtTimestamp * 1000);
                const accessEndDate = new Date(canceledDate);
                
                // Déterminer le type d'abonnement
                const proMonthlyPriceIds = [
                  'price_1STdvsQ95ijGuOd8DTnBtkkE', // Live
                  'price_1SXNw9Pt6mHWDz2H2gH72U3w', // Test
                ];
                const proAnnualPriceIds = [
                  'price_1STdyaQ95ijGuOd8OjQauruf', // Live
                  'price_1SXNxXPt6mHWDz2H8rm3Vnwh', // Test
                ];
                
                if (proMonthlyPriceIds.includes(priceId)) {
                  accessEndDate.setMonth(accessEndDate.getMonth() + 1);
                  console.log('[Stripe] Calculated currentPeriodEnd for monthly: canceled_at + 1 month');
                } else if (proAnnualPriceIds.includes(priceId)) {
                  accessEndDate.setFullYear(accessEndDate.getFullYear() + 1);
                  console.log('[Stripe] Calculated currentPeriodEnd for annual: canceled_at + 1 year');
                }
                
                currentPeriodEnd = accessEndDate.toISOString();
                console.log('[Stripe] Found canceled subscription by customer_id:', foundSubscriptionId, 'pro_access_until:', currentPeriodEnd);
              } else {
                // Fallback: utiliser current_period_end si canceled_at n'est pas disponible
                if ((canceledSubscription as any).current_period_end) {
                  currentPeriodEnd = new Date((canceledSubscription as any).current_period_end * 1000).toISOString();
                } else {
                  // Dernier fallback: récupérer la subscription complète depuis Stripe
                  console.log('[Stripe] current_period_end not in canceled subscription list, retrieving full subscription...');
                  try {
                    const fullCanceledSubscription = await stripe.subscriptions.retrieve(canceledSubscription.id);
                    if ((fullCanceledSubscription as any).current_period_end) {
                      currentPeriodEnd = new Date((fullCanceledSubscription as any).current_period_end * 1000).toISOString();
                      console.log('[Stripe] Retrieved current_period_end from full subscription:', currentPeriodEnd);
                    }
                  } catch (retrieveError) {
                    console.error('[Stripe] Error retrieving full canceled subscription:', retrieveError);
                  }
                }
              }
            }
          }
          
          // Méthode 2: Chercher par client_reference_id (userId) dans les sessions
          if (!foundSubscriptionId) {
            console.log('[Stripe] Searching by client_reference_id (userId):', userId);
            const sessions = await stripe.checkout.sessions.list({
              limit: 100,
            });

            for (const session of sessions.data) {
              if (session.client_reference_id === userId && session.subscription) {
                const sessionSubscriptionId = session.subscription as string;
                if (!foundCustomerId) {
                  foundCustomerId = session.customer as string;
                }
                
                try {
                  const subscription = await stripe.subscriptions.retrieve(sessionSubscriptionId);
                  if (subscription.status === 'active' || subscription.status === 'trialing') {
                    foundSubscriptionId = sessionSubscriptionId;
                    const priceId = subscription.items.data[0]?.price.id;
                    subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId] || null;
                    console.log('[Stripe] Found subscription by client_reference_id:', foundSubscriptionId);
                    break;
                  }
                } catch (err) {
                  continue;
                }
              }
            }
          }

          // Méthode 3: Chercher par email dans les customers
          if (!foundSubscriptionId && userData.email) {
            console.log('[Stripe] Searching by email:', userData.email);
            const customers = await stripe.customers.list({
              email: userData.email,
              limit: 10,
            });

            for (const customer of customers.data) {
              const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: 'all',
                limit: 10,
              });

              const activeSubscription = subscriptions.data.find(
                sub => sub.status === 'active' || sub.status === 'trialing'
              );

              if (activeSubscription) {
                foundSubscriptionId = activeSubscription.id;
                foundCustomerId = customer.id;
                const priceId = activeSubscription.items.data[0]?.price.id;
                subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId] || null;
                console.log('[Stripe] Found subscription by email:', foundSubscriptionId);
                break;
              }
            }
          }

          // Mettre à jour l'utilisateur avec les IDs trouvés et pro_access_until
          if (foundCustomerId || foundSubscriptionId || subscriptionStatus || currentPeriodEnd) {
            const updateData: any = {};
            
            if (foundCustomerId && foundCustomerId !== userData.stripe_customer_id) {
              updateData.stripe_customer_id = foundCustomerId;
            }
            
            if (foundSubscriptionId && foundSubscriptionId !== userData.stripe_subscription_id) {
              updateData.stripe_subscription_id = foundSubscriptionId;
            }
            
            if (subscriptionStatus && subscriptionStatus !== userData.subscription_status) {
              updateData.subscription_status = subscriptionStatus;
            }
            
            // Mettre à jour pro_access_until si l'abonnement est annulé et qu'on a current_period_end
            if (currentPeriodEnd && subscriptionStatus === 'free') {
              updateData.pro_access_until = currentPeriodEnd;
              console.log('[Stripe] Setting pro_access_until for canceled subscription:', currentPeriodEnd);
            } else if (currentPeriodEnd && subscriptionStatus) {
              // Même pour les abonnements actifs, mettre à jour pro_access_until
              updateData.pro_access_until = currentPeriodEnd;
            }

            if (Object.keys(updateData).length > 0) {
              const { error: updateError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', userData.id);

              if (updateError) {
                console.error('[Stripe] Error updating user:', updateError);
                return res.status(500).json({ 
                  error: 'Failed to update user',
                  details: updateError.message 
                });
              }

              console.log('[Stripe] ✅ User updated with:', updateData);
              
              return res.status(200).json({
                success: true,
                message: 'Subscription synced successfully',
                data: {
                  stripe_customer_id: foundCustomerId || userData.stripe_customer_id,
                  stripe_subscription_id: foundSubscriptionId || userData.stripe_subscription_id,
                  subscription_status: subscriptionStatus || userData.subscription_status,
                  pro_access_until: currentPeriodEnd || null,
                  updated: updateData,
                }
              });
            } else {
              return res.status(200).json({
                success: true,
                message: 'No changes needed - subscription already synced',
                data: {
                  stripe_customer_id: userData.stripe_customer_id,
                  stripe_subscription_id: userData.stripe_subscription_id,
                  subscription_status: userData.subscription_status,
                }
              });
            }
          } else {
            return res.status(404).json({
              success: false,
              error: 'No active subscription found in Stripe',
              message: 'Could not find any active subscription for this user in Stripe. Please ensure you have an active subscription.',
            });
          }
        } catch (stripeError: any) {
          console.error('[Stripe] Error syncing subscription:', stripeError);
          return res.status(500).json({
            error: 'Error syncing subscription',
            details: stripeError.message || 'Unknown error'
          });
        }
      }

      case 'get-purchase-history': {
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
          .select('stripe_customer_id, email')
          .eq('id', userId)
          .single();

        if (!userError && userData?.stripe_customer_id) {
          customerId = userData.stripe_customer_id;
        } else if (!userError && userData?.email) {
          // Try to find customer by email
          try {
            const customers = await stripe.customers.list({
              email: userData.email,
              limit: 1,
            });
            if (customers.data.length > 0) {
              customerId = customers.data[0].id;
            }
          } catch (err) {
            console.error('[Stripe] Error searching customer by email:', err);
          }
        }

        if (!customerId) {
          return res.status(200).json([]);
        }

        const purchaseHistory: Array<{
          id: string;
          type: 'subscription' | 'one-time';
          description: string;
          amount: number;
          currency: string;
          status: string;
          date: string;
          planType?: 'pro_monthly' | 'pro_annual' | null;
        }> = [];

        try {
          // Get invoices (for subscriptions and one-time payments)
          const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 20,
          });

          for (const invoice of invoices.data) {
            if (invoice.status === 'paid' && invoice.amount_paid && invoice.amount_paid > 0) {
              const lineItem = invoice.lines.data[0];
              const price = (lineItem as any)?.price;
              const isSubscription = (invoice as any).subscription !== null && (invoice as any).subscription !== undefined;

              let description = '';
              let planType: 'pro_monthly' | 'pro_annual' | null = null;

              if (isSubscription && price && typeof price === 'object' && !price.deleted) {
                const priceId = (price as any).id;
                // Check if it's a subscription plan
                if (PRICE_TO_SUBSCRIPTION_STATUS[priceId]) {
                  planType = PRICE_TO_SUBSCRIPTION_STATUS[priceId];
                  description = planType === 'pro_monthly' 
                    ? 'Pro Monthly Subscription'
                    : 'Pro Annual Subscription';
                } else {
                  description = (price as any).nickname || priceId || 'Subscription';
                }
              } else if (price && typeof price === 'object' && !price.deleted) {
                // One-time payment (token pack)
                const priceId = (price as any).id;
                if (priceId && priceId.includes('token')) {
                  description = 'Token Pack';
                } else {
                  description = (price as any).nickname || 'One-time Payment';
                }
              } else {
                description = invoice.description || 'Payment';
              }

              purchaseHistory.push({
                id: invoice.id,
                type: isSubscription ? 'subscription' : 'one-time',
                description,
                amount: invoice.amount_paid / 100, // Convert from cents
                currency: invoice.currency.toUpperCase(),
                status: invoice.status,
                date: new Date(invoice.created * 1000).toISOString(),
                planType,
              });
            }
          }

          // Also get checkout sessions for one-time payments and subscriptions
          const checkoutSessions = await stripe.checkout.sessions.list({
            customer: customerId,
            limit: 20,
            expand: ['data.line_items'],
          });

          for (const session of checkoutSessions.data) {
            if (session.payment_status === 'paid' && session.amount_total && session.amount_total > 0) {
              // Check if this session is already in invoices
              const alreadyInHistory = purchaseHistory.some(item => 
                item.id === session.id || 
                (session.invoice && item.id === session.invoice as string) ||
                (session.subscription && purchaseHistory.some(p => p.type === 'subscription' && p.id === session.subscription as string))
              );

              if (!alreadyInHistory) {
                let description = 'Payment';
                let planType: 'pro_monthly' | 'pro_annual' | null = null;

                // Try to get line_items from expanded data first
                let priceId: string | undefined;
                if (session.line_items?.data && session.line_items.data.length > 0) {
                  priceId = (session.line_items.data[0] as any)?.price?.id;
                } else {
                  // If not expanded, retrieve the session with expanded line_items
                  try {
                    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
                      expand: ['line_items'],
                    });
                    priceId = (expandedSession.line_items?.data[0] as any)?.price?.id;
                  } catch (err) {
                    console.warn('[Stripe] Could not expand session line_items:', err);
                  }
                }

                if (priceId) {
                  if (PRICE_TO_SUBSCRIPTION_STATUS[priceId]) {
                    planType = PRICE_TO_SUBSCRIPTION_STATUS[priceId];
                    description = planType === 'pro_monthly' 
                      ? 'Pro Monthly Subscription'
                      : 'Pro Annual Subscription';
                  } else {
                    description = 'Token Pack';
                  }
                }

                purchaseHistory.push({
                  id: session.id,
                  type: session.mode === 'subscription' ? 'subscription' : 'one-time',
                  description,
                  amount: session.amount_total / 100,
                  currency: session.currency?.toUpperCase() || 'USD',
                  status: session.payment_status,
                  date: new Date(session.created * 1000).toISOString(),
                  planType,
                });
              }
            }
          }

          // Sort by date (newest first)
          purchaseHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          return res.status(200).json(purchaseHistory);
        } catch (error: any) {
          console.error('[Stripe] Error getting purchase history:', error);
          return res.status(500).json({ error: 'Failed to get purchase history', details: error.message });
        }
      }

      default:
        return res.status(400).json({ error: 'Invalid action. Use: create-checkout-session, create-portal-session, get-subscription-status, cancel-subscription, sync-user-subscription, or get-purchase-history' });
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

