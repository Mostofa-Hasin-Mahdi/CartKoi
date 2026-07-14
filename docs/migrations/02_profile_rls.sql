-- Migration: 02_profile_rls.sql

-- Allow Owners to view the profiles of employees assigned to their carts
CREATE POLICY "Owners can view profiles of their employees"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.cart_employees ce
    JOIN public.carts c ON ce.cart_id = c.id
    WHERE ce.employee_id = public.profiles.id 
    AND c.owner_id = auth.uid()
  )
);
