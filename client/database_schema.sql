-- 1. Custom Types (Enums)
CREATE TYPE user_role AS ENUM ('owner', 'employee');

-- 2. Profiles Table (Extends Supabase Auth)
-- Every time a user signs up, they get a profile.
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'owner'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Carts Table (The "Tenant" or "Organization")
CREATE TABLE public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  foodpanda_link TEXT,
  social_links JSONB, -- Stores {"facebook": "...", "instagram": "..."}
  lat DOUBLE PRECISION, -- Latitude
  lng DOUBLE PRECISION, -- Longitude
  is_open BOOLEAN DEFAULT false,
  operating_hours JSONB, -- Stores {"monday": "10am-8pm", ...}
  image_url TEXT, -- Link to Supabase Storage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cart Employees Table (Links employees to specific carts)
-- This allows an employee to work at a specific cart.
CREATE TABLE public.cart_employees (
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (cart_id, employee_id)
);

-- 5. Menu Items Table
CREATE TABLE public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true, -- Employees toggle this when out of stock
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reviews Table (Anonymous)
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Carts
-- Anyone can read carts (needed for the public map)
CREATE POLICY "Anyone can view carts" 
ON public.carts FOR SELECT USING (true);

-- Owners can insert, update, and delete their own carts
CREATE POLICY "Owners can manage their carts" 
ON public.carts FOR ALL USING (auth.uid() = owner_id);

-- Employees can UPDATE the cart they are assigned to (e.g. location, is_open)
CREATE POLICY "Employees can update assigned carts" 
ON public.carts FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.cart_employees 
    WHERE cart_id = public.carts.id AND employee_id = auth.uid()
  )
);

-- 3. Cart Employees
-- Owners can manage employees for their carts
CREATE POLICY "Owners manage cart employees" 
ON public.cart_employees FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.carts 
    WHERE id = public.cart_employees.cart_id AND owner_id = auth.uid()
  )
);

-- Employees can view their own assignment
CREATE POLICY "Employees view own assignments" 
ON public.cart_employees FOR SELECT USING (employee_id = auth.uid());

-- 4. Menu Items
-- Anyone can view the menu
CREATE POLICY "Anyone can view menu items" 
ON public.menu_items FOR SELECT USING (true);

-- Owners or assigned Employees can manage menu items
CREATE POLICY "Owners and Employees can manage menu items" 
ON public.menu_items FOR ALL USING (
  -- Is Owner?
  EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND owner_id = auth.uid())
  OR 
  -- Is Employee assigned to this cart?
  EXISTS (SELECT 1 FROM public.cart_employees WHERE cart_id = public.menu_items.cart_id AND employee_id = auth.uid())
);

-- 5. Reviews
-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews FOR SELECT USING (true);

-- Anyone can insert a review (Anonymous)
-- Explicitly targeting 'anon' and 'authenticated' roles to acknowledge the public UGC tradeoff.
CREATE POLICY "Anyone can insert reviews" 
ON public.reviews 
AS PERMISSIVE FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- We leave this as true to allow anonymous inserts, 
  -- but rely on the table-level CHECK constraint (rating 1-5) for data integrity.
  true
);

