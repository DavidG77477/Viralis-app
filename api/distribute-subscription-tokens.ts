import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Optional: Add a secret key for cron job security
const CRON_SECRET = process.env.CRON_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron job request (optional but recommended)
  if (CRON_SECRET && req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Token Distribution] Supabase not configured');
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const now = new Date();
    
    // Find all distributions that are due (next_distribution_date <= now)
    // and haven't distributed all months yet
    const { data: distributions, error: fetchError } = await supabase
      .from('subscription_token_distributions')
      .select('*')
      .lte('next_distribution_date', now.toISOString());
    
    // Filter in JavaScript to avoid using raw SQL
    const eligibleDistributions = distributions?.filter(
      (dist) => dist.months_distributed < dist.total_months
    ) || [];

    if (fetchError) {
      console.error('[Token Distribution] Error fetching distributions:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch distributions', details: fetchError.message });
    }

    if (!eligibleDistributions || eligibleDistributions.length === 0) {
      return res.status(200).json({ 
        message: 'No distributions due',
        count: 0 
      });
    }

    console.log(`[Token Distribution] Found ${eligibleDistributions.length} distributions due`);

    const results = {
      success: 0,
      failed: 0,
      details: [] as Array<{ userId: string; success: boolean; error?: string }>
    };

    // Process each distribution
    for (const distribution of eligibleDistributions) {
      try {
        // Add tokens to user
        // Parameters must be in alphabetical order for Supabase RPC: tokens_to_add, user_id
        const { error: tokenError } = await supabase.rpc('increment_tokens', {
          tokens_to_add: distribution.tokens_per_month,
          user_id: distribution.user_id,
        });

        if (tokenError) {
          console.error(`[Token Distribution] Error adding tokens for user ${distribution.user_id}:`, tokenError);
          results.failed++;
          results.details.push({
            userId: distribution.user_id,
            success: false,
            error: tokenError.message
          });
          continue;
        }

        // Calculate next distribution date (1 month from now)
        const nextDate = new Date(now);
        nextDate.setMonth(nextDate.getMonth() + 1);

        // Update distribution record
        const { error: updateError } = await supabase
          .from('subscription_token_distributions')
          .update({
            months_distributed: distribution.months_distributed + 1,
            last_distribution_date: now.toISOString(),
            next_distribution_date: nextDate.toISOString(),
          })
          .eq('id', distribution.id);

        if (updateError) {
          console.error(`[Token Distribution] Error updating distribution ${distribution.id}:`, updateError);
          results.failed++;
          results.details.push({
            userId: distribution.user_id,
            success: false,
            error: updateError.message
          });
          continue;
        }

        console.log(`[Token Distribution] Distributed ${distribution.tokens_per_month} tokens to user ${distribution.user_id} (month ${distribution.months_distributed + 1}/${distribution.total_months})`);
        results.success++;
        results.details.push({
          userId: distribution.user_id,
          success: true
        });

      } catch (error: any) {
        console.error(`[Token Distribution] Unexpected error for distribution ${distribution.id}:`, error);
        results.failed++;
        results.details.push({
          userId: distribution.user_id,
          success: false,
          error: error.message
        });
      }
    }

    return res.status(200).json({
      message: 'Distribution completed',
      total: eligibleDistributions.length,
      success: results.success,
      failed: results.failed,
      details: results.details
    });

  } catch (error: any) {
    console.error('[Token Distribution] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Distribution failed', 
      message: error.message 
    });
  }
}

