-- Migration: 07_ai_review_summary.sql

-- Add columns to the carts table to store the AI summary and track review count
ALTER TABLE public.carts 
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS last_summarized_review_count INTEGER DEFAULT 0;
