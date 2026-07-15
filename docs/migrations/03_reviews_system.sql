-- Migration: 03_reviews_system.sql

-- 1. Add reviewer_name column to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_name VARCHAR(255) DEFAULT 'Anonymous';

-- 2. Add an RLS policy so Owners can delete reviews made on their specific carts
DROP POLICY IF EXISTS "Owners can delete reviews of their carts" ON public.reviews;

CREATE POLICY "Owners can delete reviews of their carts" 
ON public.reviews FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.carts 
    WHERE id = cart_id 
    AND owner_id = auth.uid()
  )
);
