-- Migration: 09_cart_images.sql

-- Add image_url column to carts table to store brand photo
ALTER TABLE public.carts 
ADD COLUMN IF NOT EXISTS image_url TEXT;
