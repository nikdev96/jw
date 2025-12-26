-- Migration: Add category hierarchy and flags
-- Date: 2025-12-23
-- Description: Extends categories table for JUSTWEED structure

-- Add new columns
ALTER TABLE categories
ADD COLUMN parent_id INTEGER,
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN is_info_only BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN coming_soon BOOLEAN NOT NULL DEFAULT false;

-- Add foreign key constraint
ALTER TABLE categories
ADD CONSTRAINT fk_categories_parent_id
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Create index for parent_id (performance)
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Create index for common queries
CREATE INDEX idx_categories_active_info ON categories(is_active, is_info_only);
