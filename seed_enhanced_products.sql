-- Enhanced Product Seed Data with Images, Type, and THC
-- For JUSTWEED Cannabis Store
-- Created: 2025-12-26

-- FLOWER CATEGORY (ID: 1) - Premium Strains
INSERT INTO products (name, description, price, images, category_id, is_active, sort_order, type, thc) VALUES
('OG Kush Premium', 'Classic strain with earthy pine notes and deeply relaxing effects. Perfect for evening use and stress relief.', 2500.00,
 '["https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80"]',
 1, true, 1, 'Indica', 22.00),

('Girl Scout Cookies', 'Sweet earthy flavor with euphoric balanced high. Popular hybrid with creative and uplifting effects.', 2800.00,
 '["https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1517191297489-5ff0c0da51b4?w=800&h=600&fit=crop&q=80"]',
 1, true, 2, 'Hybrid', 25.00),

('Blue Dream', 'Sativa-dominant hybrid with sweet berry aroma and cerebral high. Great for daytime creativity and focus.', 2400.00,
 '["https://images.unsplash.com/photo-1517191297489-5ff0c0da51b4?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80"]',
 1, true, 3, 'Sativa', 18.50),

('Purple Haze', 'Legendary sativa strain with sweet berry flavor and long-lasting uplifting effects. Energizing and creative.', 2700.00,
 '["https://images.unsplash.com/photo-1612544409025-f4181e665dfc?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80"]',
 1, true, 4, 'Sativa', 19.00),

('Northern Lights', 'Pure indica with spicy, earthy aroma and deep body relaxation. Ideal for pain relief and sleep.', 2600.00,
 '["https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1612544409025-f4181e665dfc?w=800&h=600&fit=crop&q=80"]',
 1, true, 5, 'Indica', 21.50);

-- EDIBLES CATEGORY (ID: 2) - Premium Infused Products
INSERT INTO products (name, description, price, images, category_id, is_active, sort_order, type, thc) VALUES
('Chocolate Chip Cookies', 'Classic homemade cookies infused with premium hybrid cannabis. 10mg THC per cookie, 5 cookies per pack.', 800.00,
 '["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80"]',
 2, true, 1, 'Hybrid', 10.00),

('Berry Blast Gummies', 'Delicious mixed berry gummies with precise dosing. 5mg THC per gummy, 20 pieces. Perfect for beginners.', 650.00,
 '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80"]',
 2, true, 2, 'Sativa', 5.00),

('Dark Chocolate Bar', 'Premium 70% cacao dark chocolate infused with indica extract. 100mg THC total, scored into 10 pieces.', 900.00,
 '["https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop&q=80"]',
 2, true, 3, 'Indica', 10.00),

('Mango Tango Gummies', 'Tropical mango flavored gummies with energizing sativa blend. 10mg per piece, 10 pieces per pack.', 750.00,
 '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&h=600&fit=crop&q=80"]',
 2, true, 4, 'Sativa', 10.00),

('Brownies Classic', 'Rich fudgy brownies made with premium hybrid cannabis butter. 25mg THC per brownie, 4 brownies per box.', 1200.00,
 '["https://images.unsplash.com/photo-1564355808853-7f36b06279bb?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80"]',
 2, true, 5, 'Hybrid', 25.00);

-- PRE-ROLLS CATEGORY (ID: 3) - Ready to Smoke
INSERT INTO products (name, description, price, images, category_id, is_active, sort_order, type, thc) VALUES
('OG Kush Pre-Roll 1g', 'Premium OG Kush flower rolled in organic hemp paper. Perfect cone for solo sessions. Pure indica relaxation.', 350.00,
 '["https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80"]',
 3, true, 1, 'Indica', 22.00),

('Sativa Blend 3-Pack', 'Three 0.5g pre-rolls of premium sativa blend. Uplifting and energizing. Great for sharing or on-the-go.', 800.00,
 '["https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80"]',
 3, true, 2, 'Sativa', 19.00),

('Hybrid Power Pack', 'Five 1g pre-rolls of our best-selling hybrid strains. Balanced effects, premium quality. Party pack!', 1500.00,
 '["https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80"]',
 3, true, 3, 'Hybrid', 23.00),

('Purple Haze King Size', 'Extra-large 1.5g pre-roll of legendary Purple Haze. Smooth smoke, uplifting effects. For experienced users.', 500.00,
 '["https://images.unsplash.com/photo-1612544409025-f4181e665dfc?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=800&h=600&fit=crop&q=80"]',
 3, true, 4, 'Sativa', 19.00),

('Indica Chill Mini 5-Pack', 'Five mini 0.5g pre-rolls of relaxing indica blend. Perfect for microdosing or bedtime ritual.', 600.00,
 '["https://images.unsplash.com/photo-1605005824717-b2f6a46924f5?w=800&h=600&fit=crop&q=80",
   "https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=800&h=600&fit=crop&q=80"]',
 3, true, 5, 'Indica', 20.50);

-- Set sequence for products ID (if needed)
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
