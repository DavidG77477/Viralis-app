/**
 * Stripe Service - Frontend functions
 * 
 * NOTE: This service contains placeholder functions that will be connected
 * to the actual Stripe API routes once the Stripe keys are configured.
 * 
 * Phase 2: Replace the placeholder implementations with actual API calls
 * to /api/create-checkout-session, /api/create-portal-session, etc.
 */

export type PlanId = 'token-pack' | 'premium-tokens' | 'pro-monthly' | 'pro-annual';

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface SubscriptionStatus {
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | null;
  planType: 'pro_monthly' | 'pro_annual' | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Create a Stripe Checkout session for the selected plan
 * 
 * Phase 2: Replace with actual API call to /api/create-checkout-session
 * 
 * @param planId - The plan identifier
 * @param userId - The user's ID from Supabase
 * @returns Promise with checkout session URL
 */
export const createCheckoutSession = async (
  planId: PlanId,
  userId: string,
  language?: 'fr' | 'en' | 'es'
): Promise<CheckoutSessionResponse> => {
  const response = await fetch('/api/stripe?action=create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, userId, language: language || 'en' }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create checkout session' }));
    throw new Error(error.error || 'Failed to create checkout session');
  }
  
  return response.json();
};

/**
 * Create a Stripe Customer Portal session for subscription management
 * 
 * Phase 2: Replace with actual API call to /api/create-portal-session
 * 
 * @param userId - The user's ID from Supabase
 * @returns Promise with portal session URL
 */
export const createPortalSession = async (
  userId: string,
  language?: 'fr' | 'en' | 'es'
): Promise<string> => {
  const response = await fetch('/api/stripe?action=create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, language: language || 'en' }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create portal session' }));
    throw new Error(error.error || 'Failed to create portal session');
  }
  
  const data = await response.json();
  return data.url;
};

/**
 * Get the current subscription status for a user
 * 
 * Phase 2: Replace with actual API call to /api/get-subscription-status
 * 
 * @param userId - The user's ID from Supabase
 * @returns Promise with subscription status
 */
export const getSubscriptionStatus = async (userId: string): Promise<SubscriptionStatus> => {
  const response = await fetch(`/api/stripe?action=get-subscription-status&userId=${userId}`);
  
  if (!response.ok) {
    // If error, return null status (user might not have subscription)
    return {
      status: null,
      planType: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    };
  }
  
  return response.json();
};

/**
 * Map plan IDs to Stripe Price IDs
 * 
 * Note: This is for reference only. The actual Price IDs are selected
 * server-side in api/stripe.ts based on the STRIPE_SECRET_KEY (test vs live).
 * 
 * Live mode Price IDs:
 */
const PLAN_TO_PRICE_ID_LIVE: Record<PlanId, string> = {
  'token-pack': 'price_1STdsSQ95ijGuOd86o9Kz6Xn',
  'premium-tokens': 'price_1STdtvQ95ijGuOd8hnKkQEE5',
  'pro-monthly': 'price_1STdvsQ95ijGuOd8DTnBtkkE',
  'pro-annual': 'price_1STdyaQ95ijGuOd8OjQauruf',
};

/**
 * Test mode Price IDs:
 */
const PLAN_TO_PRICE_ID_TEST: Record<PlanId, string> = {
  'token-pack': 'price_1SXNuYPt6mHWDz2H77mFGPPJ',
  'premium-tokens': 'price_1SXNvGPt6mHWDz2HgoV6VX8Y',
  'pro-monthly': 'price_1SXNw9Pt6mHWDz2H2gH72U3w',
  'pro-annual': 'price_1SXNxXPt6mHWDz2H8rm3Vnwh',
};

/**
 * Legacy export for backwards compatibility
 * Note: Server-side code in api/stripe.ts handles test/live mode selection
 */
export const PLAN_TO_PRICE_ID: Record<PlanId, string> = PLAN_TO_PRICE_ID_LIVE;

/**
 * Cancel a subscription (will cancel at the end of the billing period)
 * 
 * @param userId - The user's ID from Supabase
 * @returns Promise with cancellation details
 */
export const cancelSubscription = async (userId: string): Promise<{
  success: boolean;
  message: string;
  cancel_at_period_end: boolean;
  current_period_end: string;
}> => {
  const response = await fetch('/api/cancel-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to cancel subscription' }));
    throw new Error(error.error || 'Failed to cancel subscription');
  }
  
  return response.json();
};

/**
 * Check if a plan is a subscription (recurring) or one-time payment
 */
export const isSubscriptionPlan = (planId: PlanId): boolean => {
  return planId === 'pro-monthly' || planId === 'pro-annual';
};

