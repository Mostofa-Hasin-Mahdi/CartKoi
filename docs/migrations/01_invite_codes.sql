-- Migration: 01_invite_codes.sql

-- 1. Add invite_code to carts
ALTER TABLE public.carts ADD COLUMN IF NOT EXISTS invite_code VARCHAR(10) UNIQUE;

-- 2. Add an RLS policy to cart_employees so employees can join
-- We need to allow an authenticated user to insert a row where employee_id = auth.uid()
-- They must also have a valid cart_id. We'll enforce the logic via the application, 
-- but we only let them insert if they are assigning THEMSELVES.
DROP POLICY IF EXISTS "Employees can self-assign" ON public.cart_employees;

CREATE POLICY "Employees can self-assign" 
ON public.cart_employees 
AS PERMISSIVE FOR INSERT 
TO authenticated 
WITH CHECK ( employee_id = auth.uid() );
