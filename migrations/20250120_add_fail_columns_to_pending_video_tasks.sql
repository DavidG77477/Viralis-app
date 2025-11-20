-- Migration: Add fail_msg and fail_code columns to pending_video_tasks
-- Date: 2025-01-20
-- Description: Adds columns to store detailed error messages and codes for failed video generation tasks
-- Project: nxbnmcwvjudgcsdhhaug

-- Add fail_msg and fail_code columns
ALTER TABLE pending_video_tasks 
ADD COLUMN IF NOT EXISTS fail_msg TEXT,
ADD COLUMN IF NOT EXISTS fail_code TEXT;

-- Ensure RLS is enabled
ALTER TABLE pending_video_tasks ENABLE ROW LEVEL SECURITY;

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS pending_video_tasks_user_id_idx ON pending_video_tasks(user_id);
CREATE INDEX IF NOT EXISTS pending_video_tasks_task_id_idx ON pending_video_tasks(task_id);
CREATE INDEX IF NOT EXISTS pending_video_tasks_status_idx ON pending_video_tasks(status);

-- Add comment to force PostgREST cache refresh
COMMENT ON TABLE pending_video_tasks IS 'Stores pending video generation tasks for webhook tracking';

-- Recreate RLS policies to ensure they're properly configured
DROP POLICY IF EXISTS "Users can view their own pending tasks" ON pending_video_tasks;
DROP POLICY IF EXISTS "Users can create their own pending tasks" ON pending_video_tasks;
DROP POLICY IF EXISTS "Users can update their own pending tasks" ON pending_video_tasks;

CREATE POLICY "Users can view their own pending tasks"
  ON pending_video_tasks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pending tasks"
  ON pending_video_tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending tasks"
  ON pending_video_tasks
  FOR UPDATE
  USING (auth.uid() = user_id);
