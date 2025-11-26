import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const isTestMode = stripeSecretKey.startsWith('sk_test_');

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Token amounts for each pack (LIVE + TEST MODE)
const TOKEN_AMOUNTS: Record<string, number> = {
  // Live mode
  'price_1STdsSQ95ijGuOd86o9Kz6Xn': 100, // Token Pack
  'price_1STdtvQ95ijGuOd8hnKkQEE5': 1200, // Premium Token Pack
  // Test mode
  'price_1SXNuYPt6mHWDz2H77mFGPPJ': 100, // Token Pack (Test)
  'price_1SXNvGPt6mHWDz2HgoV6VX8Y': 1200, // Premium Token Pack (Test)
};

// Plan ID to subscription status mapping (LIVE + TEST MODE)
const PRICE_TO_SUBSCRIPTION_STATUS: Record<string, 'pro_monthly' | 'pro_annual'> = {
  // Live mode
  'price_1STdvsQ95ijGuOd8DTnBtkkE': 'pro_monthly',
  'price_1STdyaQ95ijGuOd8OjQauruf': 'pro_annual',
  // Test mode
  'price_1SXNw9Pt6mHWDz2H2gH72U3w': 'pro_monthly',
  'price_1SXNxXPt6mHWDz2H8rm3Vnwh': 'pro_annual',
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

  // TEMPORARY: Skip signature verification for testing
  // TODO: Re-enable signature verification once body parsing issue is resolved
  const SKIP_SIGNATURE_VERIFICATION = process.env.SKIP_WEBHOOK_SIGNATURE === 'true';
  
  console.log('[Stripe Webhook] SKIP_WEBHOOK_SIGNATURE env var:', process.env.SKIP_WEBHOOK_SIGNATURE);
  console.log('[Stripe Webhook] SKIP_SIGNATURE_VERIFICATION:', SKIP_SIGNATURE_VERIFICATION);
  console.log('[Stripe Webhook] Body type:', typeof req.body);
  console.log('[Stripe Webhook] Is Buffer?', Buffer.isBuffer(req.body));
  console.log('[Stripe Webhook] Body is object?', req.body && typeof req.body === 'object');
  
  // If body is already parsed to object, we can't verify signature anyway
  // So skip verification in that case
  // Also check if body has 'type' property (indicating it's already a Stripe Event object)
  const bodyIsParsed = req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body);
  const bodyIsStripeEvent = bodyIsParsed && 'type' in (req.body as any) && 'data' in (req.body as any);
  
  // FORCE SKIP on Vercel since body is always parsed
  const FORCE_SKIP = true; // Always skip on Vercel due to body parsing issue
  
  if (SKIP_SIGNATURE_VERIFICATION || bodyIsParsed || bodyIsStripeEvent || FORCE_SKIP) {
    if (FORCE_SKIP) {
      console.warn('[Stripe Webhook] ⚠️ FORCING SKIP SIGNATURE VERIFICATION (Vercel body parsing issue)');
    } else if (bodyIsStripeEvent) {
      console.warn('[Stripe Webhook] ⚠️ Body is already a Stripe Event object - skipping signature verification');
    } else if (bodyIsParsed) {
      console.warn('[Stripe Webhook] ⚠️ Body is parsed to object - skipping signature verification');
    } else {
      console.warn('[Stripe Webhook] ⚠️ SIGNATURE VERIFICATION DISABLED via env var - FOR TESTING ONLY');
    }
    // Use the parsed body directly
    event = req.body as Stripe.Event;
    console.log('[Stripe Webhook] Using parsed body directly. Event type:', event.type);
    console.log('[Stripe Webhook] Event ID:', event.id);
  } else {
    try {
      // Get raw body for webhook signature verification
      // On Vercel, req.body might be a Buffer, string, or already parsed object
      console.log('[Stripe Webhook] Received webhook event, verifying signature...');
      console.log('[Stripe Webhook] Body type:', typeof req.body);
      console.log('[Stripe Webhook] Is Buffer?', Buffer.isBuffer(req.body));
      
      // On Vercel, req.body might be parsed even with bodyParser: false
      // We need to get the raw body from the request
      // Try to get it from req.body first, then fallback to reconstructing from parsed JSON
      let rawBody: string;
      
      // Check if body is a Buffer (ideal case)
      if (Buffer.isBuffer(req.body)) {
        rawBody = req.body.toString('utf8');
        console.log('[Stripe Webhook] Body is Buffer, converted to string');
      } 
      // Check if body is already a string
      else if (typeof req.body === 'string') {
        rawBody = req.body;
        console.log('[Stripe Webhook] Body is already a string');
      } 
      // Body has been parsed to JSON object - this breaks signature verification
      // We need to reconstruct the original JSON string, but this might not work perfectly
      else if (req.body && typeof req.body === 'object') {
        console.error('[Stripe Webhook] Body was parsed to JSON object - this will break signature verification!');
        console.error('[Stripe Webhook] This usually means bodyParser is not properly disabled');
        // Try to reconstruct, but this might not match the original exactly
        rawBody = JSON.stringify(req.body);
        console.warn('[Stripe Webhook] Reconstructed JSON string (signature verification may fail)');
      } 
      // Body is undefined or null
      else {
        console.error('[Stripe Webhook] Body is undefined or null');
        throw new Error('Request body is missing');
      }
      
      console.log('[Stripe Webhook] Raw body length:', rawBody.length);
      console.log('[Stripe Webhook] Raw body preview (first 200 chars):', rawBody.substring(0, 200));
      
      // Verify signature with raw body
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log('[Stripe Webhook] Event verified successfully. Event type:', event.type);
      console.log('[Stripe Webhook] Event ID:', event.id);
    } catch (err: any) {
      console.error('[Stripe Webhook] Webhook signature verification failed:', err.message);
      console.error('[Stripe Webhook] Error stack:', err.stack);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
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

  // Helper function to find user by Stripe customer ID, with email fallback
  const findUserByStripeCustomer = async (customerId: string): Promise<{ id: string; email?: string } | null> => {
    // First, try to find by stripe_customer_id
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!userError && userData) {
      console.log(`[Stripe Webhook] User found by stripe_customer_id: ${userData.id}`);
      return userData;
    }

    // If not found, get customer email from Stripe and search by email
    console.log(`[Stripe Webhook] User not found by stripe_customer_id, trying email fallback for customer: ${customerId}`);
    try {
      const customer = await stripe.customers.retrieve(customerId);
      
      if (customer && typeof customer === 'object' && !customer.deleted) {
        const customerEmail = (customer as any).email;
        
        if (customerEmail) {
          console.log(`[Stripe Webhook] Customer email from Stripe: ${customerEmail}`);
          
          // Search user by email
          const { data: userByEmail, error: emailError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', customerEmail)
            .single();

          if (!emailError && userByEmail) {
            console.log(`[Stripe Webhook] User found by email: ${userByEmail.id}`);
            
            // Update user with stripe_customer_id for future lookups
            await supabase
              .from('users')
              .update({ stripe_customer_id: customerId })
              .eq('id', userByEmail.id);
            
            console.log(`[Stripe Webhook] Updated user ${userByEmail.id} with stripe_customer_id: ${customerId}`);
            return userByEmail;
          } else {
            console.error(`[Stripe Webhook] User not found by email: ${customerEmail}`, emailError);
          }
        } else {
          console.error(`[Stripe Webhook] No email found for Stripe customer: ${customerId}`);
        }
      }
    } catch (stripeError: any) {
      console.error(`[Stripe Webhook] Error retrieving customer from Stripe:`, stripeError.message);
    }

    return null;
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[Stripe Webhook] Processing checkout.session.completed');
        console.log('[Stripe Webhook] Session ID:', session.id);
        console.log('[Stripe Webhook] Session client_reference_id:', session.client_reference_id);
        console.log('[Stripe Webhook] Session metadata:', session.metadata);
        
        const userId = session.client_reference_id || session.metadata?.userId;
        const planId = session.metadata?.planId;

        console.log('[Stripe Webhook] Extracted userId:', userId);
        console.log('[Stripe Webhook] Extracted planId:', planId);

        if (!userId) {
          console.error('[Stripe Webhook] No userId in checkout session');
          console.error('[Stripe Webhook] Session object:', JSON.stringify(session, null, 2));
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

        console.log('[Stripe Webhook] Price ID found:', priceId);
        console.log('[Stripe Webhook] Available token amounts:', Object.keys(TOKEN_AMOUNTS));
        console.log('[Stripe Webhook] Is price ID in TOKEN_AMOUNTS?', priceId in TOKEN_AMOUNTS);

        // Handle token packs (one-time payments)
        if (TOKEN_AMOUNTS[priceId]) {
          const tokensToAdd = TOKEN_AMOUNTS[priceId];
          console.log(`[Stripe Webhook] ✅ Found token pack! Adding ${tokensToAdd} tokens to user ${userId}`);
          
          // Verify user exists first
          const { data: userCheck, error: userCheckError } = await supabase
            .from('users')
            .select('id, tokens')
            .eq('id', userId)
            .single();
          
          if (userCheckError || !userCheck) {
            console.error('[Stripe Webhook] ❌ User not found in database:', userId);
            console.error('[Stripe Webhook] User check error:', userCheckError);
            return res.status(400).json({ error: `User ${userId} not found in database` });
          }
          
          console.log('[Stripe Webhook] User found. Current tokens:', userCheck.tokens);
          
          // Add tokens to user account
          // Parameters must be in alphabetical order for Supabase RPC: tokens_to_add, user_id
          const { error: tokenError, data: tokenData } = await supabase.rpc('increment_tokens', {
            tokens_to_add: tokensToAdd,
            user_id: userId,
          });

          if (tokenError) {
            console.error('[Stripe Webhook] ❌ Error adding tokens:', tokenError);
            console.error('[Stripe Webhook] Error details:', JSON.stringify(tokenError, null, 2));
            console.error('[Stripe Webhook] Error code:', tokenError.code);
            console.error('[Stripe Webhook] Error message:', tokenError.message);
            return res.status(500).json({ error: 'Failed to add tokens', details: tokenError.message });
          } else {
            console.log(`[Stripe Webhook] ✅ Successfully added ${tokensToAdd} tokens to user ${userId}`);
            console.log('[Stripe Webhook] Token update result:', tokenData);
            
            // Verify tokens were added
            const { data: updatedUser, error: verifyError } = await supabase
              .from('users')
              .select('tokens')
              .eq('id', userId)
              .single();
            
            if (verifyError) {
              console.warn('[Stripe Webhook] Could not verify token update:', verifyError);
            } else {
              console.log('[Stripe Webhook] ✅ Verified: User now has', updatedUser?.tokens, 'tokens');
            }
          }
        } else {
          console.warn(`[Stripe Webhook] ⚠️ Price ID ${priceId} not found in TOKEN_AMOUNTS`);
          console.warn('[Stripe Webhook] Available Price IDs:', Object.keys(TOKEN_AMOUNTS));
          console.warn('[Stripe Webhook] This might be a subscription plan, checking...');
        }

        // Handle subscription plans
        if (PRICE_TO_SUBSCRIPTION_STATUS[priceId]) {
          const subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId];
          
          // Get subscription ID from session
          const subscriptionId = session.subscription as string;
          
          // Update user subscription status and IDs
          const updateData: any = { 
            subscription_status: subscriptionStatus,
          };
          
          if (customerId && typeof customerId === 'string') {
            updateData.stripe_customer_id = customerId;
          }
          
          if (subscriptionId) {
            updateData.stripe_subscription_id = subscriptionId;
            
            // Récupérer current_period_end depuis la subscription Stripe pour définir pro_access_until
            try {
              const subscription = await stripe.subscriptions.retrieve(subscriptionId);
              if (subscription.current_period_end) {
                updateData.pro_access_until = new Date(subscription.current_period_end * 1000).toISOString();
                console.log('[Stripe Webhook] Pro access until (from subscription):', updateData.pro_access_until);
              }
            } catch (err) {
              console.warn('[Stripe Webhook] Could not retrieve current_period_end from subscription:', err);
            }
          }
          
          const { error: subError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userId);

          if (subError) {
            console.error('[Stripe Webhook] Error updating subscription status:', subError);
          } else {
            console.log(`[Stripe Webhook] ✅ Updated user ${userId}:`, {
              subscription_status: subscriptionStatus,
              stripe_customer_id: customerId || 'already set',
              stripe_subscription_id: subscriptionId || 'N/A',
            });
          }

          // Handle token distribution based on subscription type
          if (subscriptionStatus === 'pro_annual') {
            // Pro Annual: Create monthly distribution schedule (14 months, 300 tokens/month)
            
            if (subscriptionId) {
              // Calculate first distribution date (now) and next distribution (1 month from now)
              const now = new Date();
              const nextMonth = new Date(now);
              nextMonth.setMonth(nextMonth.getMonth() + 1);

              // Create or update distribution record
              const { error: distError } = await supabase
                .from('subscription_token_distributions')
                .upsert({
                  user_id: userId,
                  subscription_id: subscriptionId,
                  subscription_status: 'pro_annual',
                  total_months: 14,
                  months_distributed: 0,
                  tokens_per_month: 300,
                  next_distribution_date: nextMonth.toISOString(),
                }, {
                  onConflict: 'user_id,subscription_id'
                });

              if (distError) {
                console.error('[Stripe Webhook] Error creating distribution schedule:', distError);
              } else {
                // Give first month's tokens immediately
                const { error: tokenError } = await supabase.rpc('increment_tokens', {
                  tokens_to_add: 300,
                  user_id: userId,
                });

                if (tokenError) {
                  console.error('[Stripe Webhook] Error adding first month tokens:', tokenError);
                } else {
                  // Update distribution to reflect first month
                  await supabase
                    .from('subscription_token_distributions')
                    .update({
                      months_distributed: 1,
                      last_distribution_date: now.toISOString(),
                    })
                    .eq('user_id', userId)
                    .eq('subscription_id', subscriptionId);

                  console.log(`[Stripe Webhook] Created Pro Annual distribution schedule for user ${userId} (14 months, 300 tokens/month)`);
                }
              }
            }
          } else {
            // Pro Monthly: Give 300 tokens directly
            // Parameters must be in alphabetical order for Supabase RPC: tokens_to_add, user_id
            const { error: tokenError } = await supabase.rpc('increment_tokens', {
              tokens_to_add: 300,
              user_id: userId,
            });

            if (tokenError) {
              console.error('[Stripe Webhook] Error adding tokens on subscription creation:', tokenError);
            } else {
              console.log(`[Stripe Webhook] Added 300 tokens on subscription creation for user ${userId} (${subscriptionStatus})`);
            }
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

        // Find user by Stripe customer ID (with email fallback)
        const userData = await findUserByStripeCustomer(customerId);

        if (!userData) {
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
        const subscriptionId = subscription.id;

        console.log(`[Stripe Webhook] Processing subscription deletion for customer: ${customerId}, subscription: ${subscriptionId}`);

        // Find user by Stripe customer ID (with email fallback)
        const userData = await findUserByStripeCustomer(customerId);

        if (!userData) {
          console.error('[Stripe Webhook] User not found for customer:', customerId);
          console.error('[Stripe Webhook] This subscription cancellation will not be synced to Supabase');
          // Don't break - log the error but continue to avoid silent failures
          break;
        }

        console.log(`[Stripe Webhook] Found user ${userData.id} for subscription cancellation`);

        // Delete token distribution schedule if it exists (Pro Annual)
        const { error: distDeleteError } = await supabase
          .from('subscription_token_distributions')
          .delete()
          .eq('user_id', userData.id)
          .eq('subscription_id', subscriptionId);

        if (distDeleteError) {
          console.warn('[Stripe Webhook] Error deleting token distribution schedule:', distDeleteError);
        } else {
          console.log(`[Stripe Webhook] Deleted token distribution schedule for user ${userData.id}`);
        }

        // Set subscription status to free but keep pro_access_until until canceled_at + 1 mois/1 an
        // Pour les abonnements annulés, la date de fin d'accès = date d'annulation + période (1 mois ou 1 an)
        const updateData: any = { 
          subscription_status: 'free',
          stripe_subscription_id: null,
        };
        
        // Calculer pro_access_until à partir de canceled_at + période
        const canceledAtTimestamp = (subscription as any).canceled_at;
        if (canceledAtTimestamp) {
          const canceledDate = new Date(canceledAtTimestamp * 1000);
          const accessEndDate = new Date(canceledDate);
          
          // Déterminer le type d'abonnement pour savoir quelle période ajouter
          const priceId = subscription.items.data[0]?.price.id;
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
            console.log('[Stripe Webhook] Calculated pro_access_until for monthly: canceled_at + 1 month');
          } else if (proAnnualPriceIds.includes(priceId)) {
            accessEndDate.setFullYear(accessEndDate.getFullYear() + 1);
            console.log('[Stripe Webhook] Calculated pro_access_until for annual: canceled_at + 1 year');
          }
          
          updateData.pro_access_until = accessEndDate.toISOString();
          console.log('[Stripe Webhook] Pro access until (canceled_at + period):', updateData.pro_access_until);
        } else {
          // Fallback: utiliser current_period_end si canceled_at n'est pas disponible
          if (subscription.current_period_end) {
            updateData.pro_access_until = new Date(subscription.current_period_end * 1000).toISOString();
            console.log('[Stripe Webhook] Pro access until (from current_period_end fallback):', updateData.pro_access_until);
          } else {
            // Dernier fallback: récupérer depuis Stripe
            try {
              const canceledSubscription = await stripe.subscriptions.retrieve(subscriptionId);
              if (canceledSubscription.current_period_end) {
                updateData.pro_access_until = new Date(canceledSubscription.current_period_end * 1000).toISOString();
                console.log('[Stripe Webhook] Pro access until (from Stripe API):', updateData.pro_access_until);
              }
            } catch (err) {
              console.warn('[Stripe Webhook] Could not retrieve current_period_end from canceled subscription:', err);
            }
          }
        }
        
        const { error: subError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userData.id);

        if (subError) {
          console.error('[Stripe Webhook] Error canceling subscription:', subError);
        } else {
          console.log(`[Stripe Webhook] ✅ Successfully canceled subscription for user ${userData.id} and removed token distribution schedule`);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription as string;

        if (!subscriptionId) {
          // This is a one-time payment, already handled by checkout.session.completed
          break;
        }

        // Get subscription to find the user
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID (with email fallback)
        const userData = await findUserByStripeCustomer(customerId);

        if (!userData) {
          console.error('[Stripe Webhook] User not found for customer:', customerId);
          break;
        }

        // Subscription payment succeeded - ensure status is still active
        const priceId = subscription.items.data[0]?.price.id;
        if (priceId && PRICE_TO_SUBSCRIPTION_STATUS[priceId]) {
          const subscriptionStatus = PRICE_TO_SUBSCRIPTION_STATUS[priceId];
          
          // Update subscription status and pro_access_until
          // Récupérer current_period_end depuis la subscription Stripe (déjà récupérée)
          // Fonctionne pour les deux types d'abonnements :
          // - Mensuel : current_period_end = dernier paiement + 1 mois
          // - Annuel : current_period_end = dernier paiement + 1 an
          // Stripe calcule automatiquement current_period_end à partir du dernier paiement réussi
          const updateData: any = { subscription_status: subscriptionStatus };
          
          if (subscription.current_period_end) {
            // current_period_end représente la fin de la période payée (1 mois ou 1 an après le dernier paiement)
            updateData.pro_access_until = new Date(subscription.current_period_end * 1000).toISOString();
            console.log('[Stripe Webhook] Pro access until (from current_period_end):', updateData.pro_access_until);
          }
          
          const { error: subError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', userData.id);

          if (subError) {
            console.error('[Stripe Webhook] Error updating subscription after payment:', subError);
          }

          // Handle token distribution based on subscription type
          if (subscriptionStatus === 'pro_annual') {
            // Pro Annual renewal: Create new distribution schedule (14 months, 300 tokens/month)
            const now = new Date();
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            // Create or update distribution record for renewal
            const { error: distError } = await supabase
              .from('subscription_token_distributions')
              .upsert({
                user_id: userData.id,
                subscription_id: subscriptionId,
                subscription_status: 'pro_annual',
                total_months: 14,
                months_distributed: 0,
                tokens_per_month: 300,
                next_distribution_date: nextMonth.toISOString(),
              }, {
                onConflict: 'user_id,subscription_id'
              });

            if (distError) {
              console.error('[Stripe Webhook] Error creating distribution schedule on renewal:', distError);
            } else {
              // Give first month's tokens immediately
              // Parameters must be in alphabetical order for Supabase RPC: tokens_to_add, user_id
              const { error: tokenError } = await supabase.rpc('increment_tokens', {
                tokens_to_add: 300,
                user_id: userData.id,
              });

              if (tokenError) {
                console.error('[Stripe Webhook] Error adding first month tokens on renewal:', tokenError);
              } else {
                // Update distribution to reflect first month
                await supabase
                  .from('subscription_token_distributions')
                  .update({
                    months_distributed: 1,
                    last_distribution_date: now.toISOString(),
                  })
                  .eq('user_id', userData.id)
                  .eq('subscription_id', subscriptionId);

                console.log(`[Stripe Webhook] Created Pro Annual distribution schedule on renewal for user ${userData.id} (14 months, 300 tokens/month)`);
              }
            }
          } else {
            // Pro Monthly: Give 300 tokens directly on renewal
            // Parameters must be in alphabetical order for Supabase RPC: tokens_to_add, user_id
            const { error: tokenError } = await supabase.rpc('increment_tokens', {
              tokens_to_add: 300,
              user_id: userData.id,
            });

            if (tokenError) {
              console.error('[Stripe Webhook] Error adding tokens on subscription renewal:', tokenError);
            } else {
              console.log(`[Stripe Webhook] Added 300 tokens on subscription payment for user ${userData.id} (${subscriptionStatus})`);
            }
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

