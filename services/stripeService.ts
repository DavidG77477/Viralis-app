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
 * Phase 2: These will be used in the API routes
 */
export const PLAN_TO_PRICE_ID: Record<PlanId, string> = {
  'token-pack': 'price_1STdsSQ95ijGuOd86o9Kz6Xn',
  'premium-tokens': 'price_1STdtvQ95ijGuOd8hnKkQEE5',
  'pro-monthly': 'price_1STdvsQ95ijGuOd8DTnBtkkE',
  'pro-annual': 'price_1STdyaQ95ijGuOd8OjQauruf',
};

/**
 * Check if a plan is a subscription (recurring) or one-time payment
 */
export const isSubscriptionPlan = (planId: PlanId): boolean => {
  return planId === 'pro-monthly' || planId === 'pro-annual';
};

