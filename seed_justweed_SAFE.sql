-- JUSTWEED Categories Seed Data (SAFE VERSION)
-- Date: 2025-12-23
-- Clean DB only - requires empty categories table

-- Safety check: fail if categories exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
    RAISE EXCEPTION 'Categories table is not empty. Run TRUNCATE categories CASCADE first.';
  END IF;
END $$;

-- Insert with dynamic IDs using DO block
DO $$
DECLARE
  cat_flower_id INT;
  cat_edibles_id INT;
  cat_prerolls_id INT;
  cat_delivery_id INT;
  cat_payments_id INT;
  cat_education_id INT;
  cat_merch_id INT;
  cat_support_id INT;
BEGIN
  -- ====================
  -- PARENT CATEGORIES
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Flower', 'flower', 1, NULL, true, false, false)
  RETURNING id INTO cat_flower_id;

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Edibles', 'edibles', 2, NULL, true, false, false)
  RETURNING id INTO cat_edibles_id;

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Pre-Rolls', 'pre-rolls', 3, NULL, true, false, false)
  RETURNING id INTO cat_prerolls_id;

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Delivery', 'delivery', 4, NULL, true, true, false)
  RETURNING id INTO cat_delivery_id;

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Payments', 'payments', 5, NULL, true, true, false)
  RETURNING id INTO cat_payments_id;

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Education', 'education', 6, NULL, true, true, false)
  RETURNING id INTO cat_education_id;

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Merch', 'merch', 7, NULL, true, false, true)
  RETURNING id INTO cat_merch_id;

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon)
  VALUES ('Support', 'support', 8, NULL, true, true, false)
  RETURNING id INTO cat_support_id;

  -- ====================
  -- CHILD CATEGORIES: Flower
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('Premium Strains', 'premium-strains', 1, cat_flower_id, true, false, false),
  ('Exotic Genetics', 'exotic-genetics', 2, cat_flower_id, true, false, false),
  ('Indica', 'indica', 3, cat_flower_id, true, false, false),
  ('Sativa', 'sativa', 4, cat_flower_id, true, false, false),
  ('Hybrid', 'hybrid', 5, cat_flower_id, true, false, false),
  ('Top Shelf', 'top-shelf', 6, cat_flower_id, true, false, false),
  ('Budget Weed', 'budget-weed', 7, cat_flower_id, true, false, false),
  ('New Drops', 'new-drops', 8, cat_flower_id, true, false, false),
  ('Limited Edition', 'limited-edition', 9, cat_flower_id, true, false, false);

  -- ====================
  -- CHILD CATEGORIES: Edibles
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('Cookies / Brownies', 'cookies-brownies', 1, cat_edibles_id, true, false, false),
  ('Gummies', 'gummies', 2, cat_edibles_id, true, false, false),
  ('Space Snacks', 'space-snacks', 3, cat_edibles_id, true, false, false),
  ('Microdose Edibles', 'microdose-edibles', 4, cat_edibles_id, true, false, false),
  ('Strong Edibles', 'strong-edibles', 5, cat_edibles_id, true, false, false);

  -- ====================
  -- CHILD CATEGORIES: Pre-Rolls
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('Classic Joints', 'classic-joints', 1, cat_prerolls_id, true, false, false),
  ('Infused Joints', 'infused-joints', 2, cat_prerolls_id, true, false, false),
  ('Mini Joints', 'mini-joints', 3, cat_prerolls_id, true, false, false),
  ('Gift Joints', 'gift-joints', 4, cat_prerolls_id, true, false, false);

  -- ====================
  -- CHILD CATEGORIES: Delivery (INFO)
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('Fast Delivery', 'fast-delivery', 1, cat_delivery_id, true, true, false),
  ('Night Delivery', 'night-delivery', 2, cat_delivery_id, true, true, false),
  ('Pick Up', 'pick-up', 3, cat_delivery_id, true, true, false),
  ('Island Delivery', 'island-delivery', 4, cat_delivery_id, true, true, false);

  -- ====================
  -- CHILD CATEGORIES: Payments (INFO)
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('Cash', 'cash', 1, cat_payments_id, true, true, false),
  ('USDT', 'usdt', 2, cat_payments_id, true, true, false),
  ('USDT → Cash', 'usdt-cash', 3, cat_payments_id, true, true, false),
  ('Crypto Support', 'crypto-support', 4, cat_payments_id, true, true, false);

  -- ====================
  -- CHILD CATEGORIES: Education (INFO)
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('Strain Info', 'strain-info', 1, cat_education_id, true, true, false),
  ('Effects & Terpenes', 'effects-terpenes', 2, cat_education_id, true, true, false),
  ('How to Choose Weed', 'how-to-choose', 3, cat_education_id, true, true, false),
  ('Storage Tips', 'storage-tips', 4, cat_education_id, true, true, false);

  -- ====================
  -- CHILD CATEGORIES: Merch (COMING SOON)
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('T-Shirts', 't-shirts', 1, cat_merch_id, true, false, true),
  ('Caps', 'caps', 2, cat_merch_id, true, false, true),
  ('Stickers', 'stickers', 3, cat_merch_id, true, false, true),
  ('Lighters', 'lighters', 4, cat_merch_id, true, false, true);

  -- ====================
  -- CHILD CATEGORIES: Support (INFO)
  -- ====================

  INSERT INTO categories (name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
  ('Contact Manager', 'contact-manager', 1, cat_support_id, true, true, false),
  ('FAQ', 'faq', 2, cat_support_id, true, true, false),
  ('Order Status', 'order-status', 3, cat_support_id, true, true, false);

  RAISE NOTICE 'Successfully inserted % categories', (SELECT COUNT(*) FROM categories);
END $$;
