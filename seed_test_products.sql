-- Test Products for JUSTWEED
-- Categories: Flower (5), Edibles (6), Pre-Rolls (7)
-- Subcategories: Premium Strains (13), Indica (15), Sativa (16), Gummies (22), Classic Joints (31)

-- FLOWER PRODUCTS
INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
-- Premium Strains (13)
('OG Kush Premium', 'Classic strain with earthy and pine notes. THC 22%', 2500.00, '["https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=400"]', 13, true, 1),
('Girl Scout Cookies', 'Sweet and earthy flavor. THC 25%', 2800.00, '["https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=400"]', 13, true, 2),
('Gelato Premium', 'Dessert-like aroma. THC 23%', 3000.00, '["https://images.unsplash.com/photo-1517191297489-5ff0c0da51b4?w=400"]', 13, true, 3),

-- Indica (15)
('Northern Lights', 'Perfect for relaxation. THC 20%', 2200.00, '["https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=400"]', 15, true, 1),
('Granddaddy Purple', 'Grape and berry flavor. THC 21%', 2400.00, '["https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=400"]', 15, true, 2),
('Bubba Kush', 'Chocolate and coffee notes. THC 19%', 2100.00, '["https://images.unsplash.com/photo-1517191297489-5ff0c0da51b4?w=400"]', 15, true, 3),

-- Sativa (16)
('Sour Diesel', 'Energizing citrus flavor. THC 22%', 2600.00, '["https://images.unsplash.com/photo-1536964310528-e47dd655ecf3?w=400"]', 16, true, 1),
('Jack Herer', 'Spicy pine aroma. THC 24%', 2700.00, '["https://images.unsplash.com/photo-1601513446926-59c96b21e3b6?w=400"]', 16, true, 2),
('Green Crack', 'Mango and citrus. THC 21%', 2500.00, '["https://images.unsplash.com/photo-1517191297489-5ff0c0da51b4?w=400"]', 16, true, 3);

-- EDIBLES PRODUCTS
-- Gummies (22)
INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
('THC Gummies Mix', 'Assorted fruit flavors. 10mg per piece', 1500.00, '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400"]', 22, true, 1),
('CBD Gummies', 'Relaxing CBD gummies. 25mg CBD per piece', 1200.00, '["https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400"]', 22, true, 2),
('Watermelon Gummies', 'Watermelon flavor. 15mg THC', 1600.00, '["https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400"]', 22, true, 3);

-- PRE-ROLLS PRODUCTS
-- Classic Joints (31)
INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
('Classic Joint 1g', 'Pre-rolled joint 1 gram', 800.00, '["https://images.unsplash.com/photo-1527843812948-4f8e42eb0d9b?w=400"]', 31, true, 1),
('Premium Joint 1.5g', 'Premium strain pre-roll', 1200.00, '["https://images.unsplash.com/photo-1527843812948-4f8e42eb0d9b?w=400"]', 31, true, 2),
('Mixed Pack 5pcs', 'Pack of 5 classic joints', 3500.00, '["https://images.unsplash.com/photo-1527843812948-4f8e42eb0d9b?w=400"]', 31, true, 3);
