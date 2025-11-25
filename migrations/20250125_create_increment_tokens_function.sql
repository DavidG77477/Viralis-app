-- Create increment_tokens function for adding tokens to user accounts
-- This is used by Stripe webhooks to credit tokens after successful payments

CREATE OR REPLACE FUNCTION public.increment_tokens(user_id UUID, tokens_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET tokens = tokens + tokens_to_add
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (needed for RPC calls)
GRANT EXECUTE ON FUNCTION public.increment_tokens(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_tokens(UUID, INTEGER) TO service_role;

