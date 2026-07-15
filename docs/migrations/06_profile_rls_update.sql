-- Migration: 06_profile_rls_update.sql

-- Drop the restrictive policy that only allows viewing own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Allow any authenticated user to view profiles (so Owners and Employees can see each other's contact info)
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);
