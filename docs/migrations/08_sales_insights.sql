-- Migration: 08_sales_insights.sql

-- 1. Create sales_logs table
CREATE TABLE IF NOT EXISTS public.sales_logs (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add ai_sales_insight column to carts table for caching
ALTER TABLE public.carts 
ADD COLUMN IF NOT EXISTS ai_sales_insight TEXT;

-- 3. Enable RLS on sales_logs
ALTER TABLE public.sales_logs ENABLE ROW LEVEL SECURITY;

-- 4. Owners can manage their own sales logs
CREATE POLICY "Owners can manage sales logs of their carts"
ON public.sales_logs FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.carts
        WHERE carts.id = sales_logs.cart_id
        AND carts.owner_id = auth.uid()
    )
);
