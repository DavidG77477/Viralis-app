-- Migration: Create subscription_token_distributions table
-- Date: 2025-01-21
-- Description: Tracks monthly token distributions for Pro Annual subscriptions
-- Project: nxbnmcwvjudgcsdhhaug

-- Create table to track token distributions
CREATE TABLE IF NOT EXISTS subscription_token_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id TEXT NOT NULL, -- Stripe subscription ID
    subscription_status TEXT NOT NULL CHECK (subscription_status IN ('pro_annual')),
    total_months INTEGER NOT NULL DEFAULT 14, -- Total months of token distribution (14 for annual)
    months_distributed INTEGER NOT NULL DEFAULT 0, -- Number of months already distributed
    tokens_per_month INTEGER NOT NULL DEFAULT 300, -- Tokens to give each month
    last_distribution_date TIMESTAMP WITH TIME ZONE, -- Last time tokens were distributed
    next_distribution_date TIMESTAMP WITH TIME ZONE NOT NULL, -- Next distribution date
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, subscription_id)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS subscription_token_distributions_user_id_idx 
    ON subscription_token_distributions(user_id);
CREATE INDEX IF NOT EXISTS subscription_token_distributions_next_distribution_date_idx 
    ON subscription_token_distributions(next_distribution_date);
CREATE INDEX IF NOT EXISTS subscription_token_distributions_subscription_id_idx 
    ON subscription_token_distributions(subscription_id);

-- Enable RLS
ALTER TABLE subscription_token_distributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own distributions" ON subscription_token_distributions;
CREATE POLICY "Users can view their own distributions"
    ON subscription_token_distributions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can do everything (for API routes)
DROP POLICY IF EXISTS "Service role can manage distributions" ON subscription_token_distributions;
CREATE POLICY "Service role can manage distributions"
    ON subscription_token_distributions
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_token_distributions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_subscription_token_distributions_updated_at_trigger 
    ON subscription_token_distributions;
CREATE TRIGGER update_subscription_token_distributions_updated_at_trigger
    BEFORE UPDATE ON subscription_token_distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_token_distributions_updated_at();

-- Add comment to force PostgREST cache refresh
COMMENT ON TABLE subscription_token_distributions IS 'Tracks monthly token distributions for Pro Annual subscriptions';

