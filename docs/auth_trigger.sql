-- Supabase Auth Trigger for Profile Creation
-- This trigger automatically creates a corresponding row in the public.profiles table 
-- whenever a new user signs up via Supabase Auth.

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    -- Extract full name from auth metadata, default to 'Unknown' if not provided
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown'),
    -- Extract role from auth metadata, default to 'owner' if not provided
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'owner'::public.user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Bind the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
