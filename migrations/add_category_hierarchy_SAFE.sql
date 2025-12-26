-- Migration: Add category hierarchy and flags
-- Date: 2025-12-23
-- Description: Extends categories table for JUSTWEED structure
-- SAFE VERSION

-- Add new columns
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS parent_id INTEGER,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS is_info_only BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS coming_soon BOOLEAN NOT NULL DEFAULT false;

-- Add foreign key constraint (RESTRICT instead of CASCADE for safety)
ALTER TABLE categories
DROP CONSTRAINT IF EXISTS fk_categories_parent_id;

ALTER TABLE categories
ADD CONSTRAINT fk_categories_parent_id
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE RESTRICT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active_info ON categories(is_active, is_info_only);

-- Comment explaining the constraint
COMMENT ON CONSTRAINT fk_categories_parent_id ON categories IS
'RESTRICT prevents accidental deletion of parent categories with children';
