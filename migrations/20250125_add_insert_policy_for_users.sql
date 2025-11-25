-- Add INSERT policy for users table to allow users to create their own profile
-- This is needed when ensureUserProfile tries to insert a new profile
-- The policy ensures users can only insert profiles with their own ID

CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

