-- ============================================================
-- TEST DATA FOR UX ONLY
-- ============================================================
-- Purpose: Visual testing of frontend product cards
-- Images: Placeholder URLs (replace with real photos later)
-- Content: Generic descriptions (replace with real copy later)
-- ============================================================

-- Get category IDs dynamically
DO $$
DECLARE
    cat_flower_id INT;
    cat_edibles_id INT;
    cat_prerolls_id INT;

    subcat_premium_id INT;
    subcat_indica_id INT;
    subcat_sativa_id INT;
    subcat_gummies_id INT;
    subcat_joints_id INT;
BEGIN
    -- Get parent category IDs
    SELECT id INTO cat_flower_id FROM categories WHERE slug = 'flower' AND parent_id IS NULL;
    SELECT id INTO cat_edibles_id FROM categories WHERE slug = 'edibles' AND parent_id IS NULL;
    SELECT id INTO cat_prerolls_id FROM categories WHERE slug = 'pre-rolls' AND parent_id IS NULL;

    -- Get subcategory IDs
    SELECT id INTO subcat_premium_id FROM categories WHERE slug = 'premium-strains' AND parent_id = cat_flower_id;
    SELECT id INTO subcat_indica_id FROM categories WHERE slug = 'indica' AND parent_id = cat_flower_id;
    SELECT id INTO subcat_sativa_id FROM categories WHERE slug = 'sativa' AND parent_id = cat_flower_id;
    SELECT id INTO subcat_gummies_id FROM categories WHERE slug = 'gummies' AND parent_id = cat_edibles_id;
    SELECT id INTO subcat_joints_id FROM categories WHERE slug = 'classic-joints' AND parent_id = cat_prerolls_id;

    -- ============================================================
    -- 🌿 FLOWER PRODUCTS (12 items - UX testing variety)
    -- ============================================================

    -- Premium Strains (4 items - mixed name lengths)
    INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
    ('OG Kush', 'Classic Indica-dominant hybrid. Earthy, pine, woody notes. THC 22%', 2500, '["https://via.placeholder.com/400x300?text=OG+Kush"]', subcat_premium_id, true, 1),
    ('Girl Scout Cookies Premium', 'Sweet and earthy with hints of mint. Balanced hybrid. THC 25%', 2800, '["https://via.placeholder.com/400x300?text=GSC"]', subcat_premium_id, true, 2),
    ('Wedding Cake', 'Creamy vanilla flavor with relaxing effect. THC 24%', 3200, '["https://via.placeholder.com/400x300?text=Wedding+Cake"]', subcat_premium_id, true, 3),
    ('Gelato', 'Dessert-like aroma, sweet citrus. Hybrid. THC 23%', 3000, '["https://via.placeholder.com/400x300?text=Gelato"]', subcat_premium_id, true, 4);

    -- Indica (4 items)
    INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
    ('Northern Lights', 'Deep relaxation, perfect for evening. THC 20%', 2200, '["https://via.placeholder.com/400x300?text=Northern+Lights"]', subcat_indica_id, true, 1),
    ('Granddaddy Purple', 'Grape and berry flavor, calming body high. THC 21%', 2400, '["https://via.placeholder.com/400x300?text=GDP"]', subcat_indica_id, true, 2),
    ('Bubba Kush', 'Chocolate and coffee notes, heavy relaxation. THC 19%', 2100, '["https://via.placeholder.com/400x300?text=Bubba+Kush"]', subcat_indica_id, true, 3),
    ('Purple Punch', 'Sweet grape candy flavor, sleepy effect. THC 20%', 2300, '["https://via.placeholder.com/400x300?text=Purple+Punch"]', subcat_indica_id, true, 4);

    -- Sativa (4 items)
    INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
    ('Sour Diesel', 'Energizing citrus, creative boost. THC 22%', 2600, '["https://via.placeholder.com/400x300?text=Sour+Diesel"]', subcat_sativa_id, true, 1),
    ('Jack Herer', 'Spicy pine aroma, uplifting cerebral effect. THC 24%', 2700, '["https://via.placeholder.com/400x300?text=Jack+Herer"]', subcat_sativa_id, true, 2),
    ('Green Crack', 'Mango citrus, energetic focus. THC 21%', 2500, '["https://via.placeholder.com/400x300?text=Green+Crack"]', subcat_sativa_id, true, 3),
    ('Durban Poison', 'Pure Sativa, sweet anise flavor, clear-headed energy. THC 23%', 2650, '["https://via.placeholder.com/400x300?text=Durban+Poison"]', subcat_sativa_id, true, 4);

    -- ============================================================
    -- 🌬 PRE-ROLLS (4 items)
    -- ============================================================

    INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
    ('Classic Joint 1g', 'Pre-rolled joint, quality flower blend. 1 gram', 800, '["https://via.placeholder.com/400x300?text=Classic+Joint"]', subcat_joints_id, true, 1),
    ('Premium Joint 1.5g', 'Premium strain pre-roll. 1.5 grams', 1200, '["https://via.placeholder.com/400x300?text=Premium+Joint"]', subcat_joints_id, true, 2),
    ('Indica Joint', 'Pure Indica pre-roll for relaxation. 1 gram', 900, '["https://via.placeholder.com/400x300?text=Indica+Joint"]', subcat_joints_id, true, 3),
    ('Mixed Pack 5pcs', 'Assorted pre-rolls, different strains. 5 pieces', 3500, '["https://via.placeholder.com/400x300?text=Mixed+Pack"]', subcat_joints_id, true, 4);

    -- ============================================================
    -- 🍪 EDIBLES (4 items)
    -- ============================================================

    INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
    ('THC Gummies Mix', 'Assorted fruit flavors. 10mg per piece, 10 pieces', 1500, '["https://via.placeholder.com/400x300?text=Gummies"]', subcat_gummies_id, true, 1),
    ('CBD Gummies', 'Relaxing CBD gummies. 25mg CBD per piece, 10 pieces', 1200, '["https://via.placeholder.com/400x300?text=CBD+Gummies"]', subcat_gummies_id, true, 2),
    ('Chocolate Brownie', 'Rich chocolate brownie. 50mg THC', 600, '["https://via.placeholder.com/400x300?text=Brownie"]', subcat_gummies_id, true, 3),
    ('Watermelon Gummies', 'Watermelon flavor. 15mg THC per piece, 8 pieces', 1600, '["https://via.placeholder.com/400x300?text=Watermelon"]', subcat_gummies_id, true, 4);

    -- ============================================================
    -- 🧰 ACCESSORIES (6 items - add to Accessories category if exists)
    -- ============================================================
    -- Note: These will be added if Accessories category exists
    -- Otherwise they'll be skipped silently

    IF EXISTS (SELECT 1 FROM categories WHERE slug = 'accessories') THEN
        DECLARE
            cat_accessories_id INT;
        BEGIN
            SELECT id INTO cat_accessories_id FROM categories WHERE slug = 'accessories';

            INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
            ('Metal Grinder', '4-piece aluminum grinder with kief catcher', 450, '["https://via.placeholder.com/400x300?text=Grinder"]', cat_accessories_id, true, 1),
            ('Rolling Papers', 'Premium rice papers, 50 leaves', 120, '["https://via.placeholder.com/400x300?text=Papers"]', cat_accessories_id, true, 2),
            ('Filter Tips', 'Pre-cut filter tips, 120 pieces', 80, '["https://via.placeholder.com/400x300?text=Filters"]', cat_accessories_id, true, 3),
            ('Glass Bong', 'Clear glass bong, 30cm height', 1800, '["https://via.placeholder.com/400x300?text=Bong"]', cat_accessories_id, true, 4),
            ('Lighter Set', 'Pack of 3 refillable lighters', 200, '["https://via.placeholder.com/400x300?text=Lighters"]', cat_accessories_id, true, 5),
            ('Storage Jar', 'Airtight glass jar for flower storage', 350, '["https://via.placeholder.com/400x300?text=Jar"]', cat_accessories_id, true, 6);
        END;
    END IF;

END $$;

-- ============================================================
-- ✅ READY TO REPLACE
-- ============================================================
-- When real data is ready:
-- 1. Replace placeholder images with real product photos
-- 2. Update descriptions with proper strain info
-- 3. Adjust prices based on real costs
-- 4. Add more product details (effects, terpenes, etc.)
-- ============================================================
