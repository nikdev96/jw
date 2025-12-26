-- Seed data for testing
-- Run after migrations: psql botshop < seed_data.sql

-- Categories
INSERT INTO categories (name, slug, sort_order) VALUES
    ('Электроника', 'electronics', 1),
    ('Одежда', 'clothing', 2),
    ('Книги', 'books', 3),
    ('Продукты', 'food', 4);

-- Products
INSERT INTO products (name, description, price, images, category_id, is_active, sort_order) VALUES
    -- Electronics
    ('iPhone 15 Pro', 'Смартфон Apple iPhone 15 Pro 256GB', 99990.00, '["https://example.com/iphone15.jpg"]'::json, 1, true, 1),
    ('AirPods Pro', 'Беспроводные наушники с активным шумоподавлением', 24990.00, '["https://example.com/airpods.jpg"]'::json, 1, true, 2),
    ('MacBook Air M2', 'Ноутбук Apple MacBook Air 13" M2 256GB', 119990.00, '["https://example.com/macbook.jpg"]'::json, 1, true, 3),

    -- Clothing
    ('Футболка базовая', 'Хлопковая футболка, размеры S-XL', 1490.00, '["https://example.com/tshirt.jpg"]'::json, 2, true, 1),
    ('Джинсы Levis 501', 'Классические прямые джинсы', 6990.00, '["https://example.com/jeans.jpg"]'::json, 2, true, 2),
    ('Кроссовки Nike Air', 'Спортивные кроссовки для бега', 8990.00, '["https://example.com/sneakers.jpg"]'::json, 2, true, 3),

    -- Books
    ('Чистый код', 'Роберт Мартин. Создание, анализ и рефакторинг', 2190.00, '["https://example.com/cleancode.jpg"]'::json, 3, true, 1),
    ('Python для сложных задач', 'Дж. Вандер Плас. Научное программирование', 3490.00, '["https://example.com/python.jpg"]'::json, 3, true, 2),

    -- Food
    ('Кофе Lavazza', 'Зерновой кофе Lavazza Qualità Rossa 1кг', 1890.00, '["https://example.com/coffee.jpg"]'::json, 4, true, 1),
    ('Шоколад Lindt', 'Молочный шоколад Lindt Excellence 100г', 490.00, '["https://example.com/chocolate.jpg"]'::json, 4, true, 2);
