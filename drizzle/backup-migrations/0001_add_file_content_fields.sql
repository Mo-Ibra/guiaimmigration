-- Migration: Add file content fields to translation_orders table
-- Date: 2025-01-27

ALTER TABLE "translation_orders" 
ADD COLUMN "original_file_content" text,
ADD COLUMN "translated_file_content" text;

-- Update status field to include 'paid' status
COMMENT ON COLUMN "translation_orders"."status" IS 'Order status: pending, paid, in_progress, completed, delivered';