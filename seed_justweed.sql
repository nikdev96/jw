-- JUSTWEED Categories Seed Data
-- Date: 2025-12-23
-- Description: Complete category structure for JUSTWEED Telegram Mini App

-- Clear existing data (if needed)
-- TRUNCATE categories CASCADE;

-- ====================
-- PARENT CATEGORIES
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(1, 'Flower', 'flower', 1, NULL, true, false, false),
(2, 'Edibles', 'edibles', 2, NULL, true, false, false),
(3, 'Pre-Rolls', 'pre-rolls', 3, NULL, true, false, false),
(4, 'Delivery', 'delivery', 4, NULL, true, true, false),
(5, 'Payments', 'payments', 5, NULL, true, true, false),
(6, 'Education', 'education', 6, NULL, true, true, false),
(7, 'Merch', 'merch', 7, NULL, true, false, true),
(8, 'Support', 'support', 8, NULL, true, true, false);

-- ====================
-- CHILD CATEGORIES: Flower
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(11, 'Premium Strains', 'premium-strains', 1, 1, true, false, false),
(12, 'Exotic Genetics', 'exotic-genetics', 2, 1, true, false, false),
(13, 'Indica', 'indica', 3, 1, true, false, false),
(14, 'Sativa', 'sativa', 4, 1, true, false, false),
(15, 'Hybrid', 'hybrid', 5, 1, true, false, false),
(16, 'Top Shelf', 'top-shelf', 6, 1, true, false, false),
(17, 'Budget Weed', 'budget-weed', 7, 1, true, false, false),
(18, 'New Drops', 'new-drops', 8, 1, true, false, false),
(19, 'Limited Edition', 'limited-edition', 9, 1, true, false, false);

-- ====================
-- CHILD CATEGORIES: Edibles
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(21, 'Cookies / Brownies', 'cookies-brownies', 1, 2, true, false, false),
(22, 'Gummies', 'gummies', 2, 2, true, false, false),
(23, 'Space Snacks', 'space-snacks', 3, 2, true, false, false),
(24, 'Microdose Edibles', 'microdose-edibles', 4, 2, true, false, false),
(25, 'Strong Edibles', 'strong-edibles', 5, 2, true, false, false);

-- ====================
-- CHILD CATEGORIES: Pre-Rolls
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(31, 'Classic Joints', 'classic-joints', 1, 3, true, false, false),
(32, 'Infused Joints', 'infused-joints', 2, 3, true, false, false),
(33, 'Mini Joints', 'mini-joints', 3, 3, true, false, false),
(34, 'Gift Joints', 'gift-joints', 4, 3, true, false, false);

-- ====================
-- CHILD CATEGORIES: Delivery (INFO ONLY)
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(41, 'Fast Delivery', 'fast-delivery', 1, 4, true, true, false),
(42, 'Night Delivery', 'night-delivery', 2, 4, true, true, false),
(43, 'Pick Up', 'pick-up', 3, 4, true, true, false),
(44, 'Island Delivery', 'island-delivery', 4, 4, true, true, false);

-- ====================
-- CHILD CATEGORIES: Payments (INFO ONLY)
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(51, 'Cash', 'cash', 1, 5, true, true, false),
(52, 'USDT', 'usdt', 2, 5, true, true, false),
(53, 'USDT → Cash', 'usdt-cash', 3, 5, true, true, false),
(54, 'Crypto Support', 'crypto-support', 4, 5, true, true, false);

-- ====================
-- CHILD CATEGORIES: Education (INFO ONLY)
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(61, 'Strain Info', 'strain-info', 1, 6, true, true, false),
(62, 'Effects & Terpenes', 'effects-terpenes', 2, 6, true, true, false),
(63, 'How to Choose Weed', 'how-to-choose', 3, 6, true, true, false),
(64, 'Storage Tips', 'storage-tips', 4, 6, true, true, false);

-- ====================
-- CHILD CATEGORIES: Merch (COMING SOON)
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(71, 'T-Shirts', 't-shirts', 1, 7, true, false, true),
(72, 'Caps', 'caps', 2, 7, true, false, true),
(73, 'Stickers', 'stickers', 3, 7, true, false, true),
(74, 'Lighters', 'lighters', 4, 7, true, false, true);

-- ====================
-- CHILD CATEGORIES: Support (INFO ONLY)
-- ====================

INSERT INTO categories (id, name, slug, sort_order, parent_id, is_active, is_info_only, coming_soon) VALUES
(81, 'Contact Manager', 'contact-manager', 1, 8, true, true, false),
(82, 'FAQ', 'faq', 2, 8, true, true, false),
(83, 'Order Status', 'order-status', 3, 8, true, true, false);

-- Reset sequence (PostgreSQL specific)
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- ====================
-- VERIFICATION QUERIES
-- ====================

-- Check parent categories
-- SELECT * FROM categories WHERE parent_id IS NULL ORDER BY sort_order;

-- Check all categories with hierarchy
-- SELECT
--   COALESCE(p.name, c.name) as parent_name,
--   c.name as category_name,
--   c.is_info_only,
--   c.coming_soon
-- FROM categories c
-- LEFT JOIN categories p ON c.parent_id = p.id
-- ORDER BY COALESCE(p.sort_order, c.sort_order), c.sort_order;
