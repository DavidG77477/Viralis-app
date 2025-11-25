-- Add Stripe columns to users table if they don't exist
-- This migration is idempotent and can be run multiple times safely

-- Add stripe_customer_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
        CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
    END IF;
END $$;

-- Add stripe_subscription_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'stripe_subscription_id'
    ) THEN
        ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
        CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users(stripe_subscription_id);
    END IF;
END $$;

-- Add subscription_status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'free';
        CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
    END IF;
END $$;

