-- Add missing DELETE policy for user_profiles table
-- This allows users to delete their own profile while maintaining RLS security

CREATE POLICY "Users can delete their own profile" ON public.user_profiles
    FOR DELETE USING (auth.uid() = id); 