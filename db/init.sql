CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role_id INT REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    menu_id INT REFERENCES menus(id),
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    amount NUMERIC(10,2) NOT NULL,
    method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name) VALUES ('admin'), ('shop_owner'), ('customer'), ('finance');

-- Insert sample users
INSERT INTO users (username, password, full_name, email, phone, role_id, created_at) VALUES
-- Admin users
('admin1', '$2b$10$dummy_hash_for_admin1', 'ผู้ดูแลระบบ 1', 'admin1@zeenzilla.com', '081-111-1111', 1, NOW() - INTERVAL '6 months'),
('admin2', '$2b$10$dummy_hash_for_admin2', 'ผู้ดูแลระบบ 2', 'admin2@zeenzilla.com', '081-111-1112', 1, NOW() - INTERVAL '5 months'),

-- Finance users
('finance1', '$2b$10$dummy_hash_for_finance1', 'นักบัญชี 1', 'finance1@zeenzilla.com', '081-222-1111', 4, NOW() - INTERVAL '5 months'),
('finance2', '$2b$10$dummy_hash_for_finance2', 'นักบัญชี 2', 'finance2@zeenzilla.com', '081-222-1112', 4, NOW() - INTERVAL '4 months'),

-- Shop owners
('shop1', '$2b$10$dummy_hash_for_shop1', 'เจ้าของร้าน กิน-อิ่ม', 'shop1@example.com', '081-333-1111', 2, NOW() - INTERVAL '6 months'),
('shop2', '$2b$10$dummy_hash_for_shop2', 'เจ้าของร้าน อร่อย-ดี', 'shop2@example.com', '081-333-1112', 2, NOW() - INTERVAL '5 months'),
('shop3', '$2b$10$dummy_hash_for_shop3', 'เจ้าของร้าน แซ่บ-เว่อร์', 'shop3@example.com', '081-333-1113', 2, NOW() - INTERVAL '4 months'),
('shop4', '$2b$10$dummy_hash_for_shop4', 'เจ้าของร้าน หอม-หวาน', 'shop4@example.com', '081-333-1114', 2, NOW() - INTERVAL '3 months'),

-- Customers (distributed over 6 months for growth chart)
('customer1', '$2b$10$dummy_hash_for_customer1', 'ลูกค้า สมชาย', 'customer1@example.com', '081-444-1111', 3, NOW() - INTERVAL '6 months'),
('customer2', '$2b$10$dummy_hash_for_customer2', 'ลูกค้า สมหญิง', 'customer2@example.com', '081-444-1112', 3, NOW() - INTERVAL '6 months'),
('customer3', '$2b$10$dummy_hash_for_customer3', 'ลูกค้า สมศักดิ์', 'customer3@example.com', '081-444-1113', 3, NOW() - INTERVAL '5 months'),
('customer4', '$2b$10$dummy_hash_for_customer4', 'ลูกค้า สมศรี', 'customer4@example.com', '081-444-1114', 3, NOW() - INTERVAL '5 months'),
('customer5', '$2b$10$dummy_hash_for_customer5', 'ลูกค้า สมบัติ', 'customer5@example.com', '081-444-1115', 3, NOW() - INTERVAL '5 months'),
('customer6', '$2b$10$dummy_hash_for_customer6', 'ลูกค้า สมปอง', 'customer6@example.com', '081-444-1116', 3, NOW() - INTERVAL '4 months'),
('customer7', '$2b$10$dummy_hash_for_customer7', 'ลูกค้า สมจิต', 'customer7@example.com', '081-444-1117', 3, NOW() - INTERVAL '4 months'),
('customer8', '$2b$10$dummy_hash_for_customer8', 'ลูกค้า สมหมาย', 'customer8@example.com', '081-444-1118', 3, NOW() - INTERVAL '4 months'),
('customer9', '$2b$10$dummy_hash_for_customer9', 'ลูกค้า สมชื่น', 'customer9@example.com', '081-444-1119', 3, NOW() - INTERVAL '3 months'),
('customer10', '$2b$10$dummy_hash_for_customer10', 'ลูกค้า สมใจ', 'customer10@example.com', '081-444-1120', 3, NOW() - INTERVAL '3 months'),
('customer11', '$2b$10$dummy_hash_for_customer11', 'ลูกค้า สมร่วม', 'customer11@example.com', '081-444-1121', 3, NOW() - INTERVAL '3 months'),
('customer12', '$2b$10$dummy_hash_for_customer12', 'ลูกค้า สมรส', 'customer12@example.com', '081-444-1122', 3, NOW() - INTERVAL '2 months'),
('customer13', '$2b$10$dummy_hash_for_customer13', 'ลูกค้า สมฤทัย', 'customer13@example.com', '081-444-1123', 3, NOW() - INTERVAL '2 months'),
('customer14', '$2b$10$dummy_hash_for_customer14', 'ลูกค้า สมพงษ์', 'customer14@example.com', '081-444-1124', 3, NOW() - INTERVAL '2 months'),
('customer15', '$2b$10$dummy_hash_for_customer15', 'ลูกค้า สมทรง', 'customer15@example.com', '081-444-1125', 3, NOW() - INTERVAL '1 month'),
('customer16', '$2b$10$dummy_hash_for_customer16', 'ลูกค้า สมเกียรติ', 'customer16@example.com', '081-444-1126', 3, NOW() - INTERVAL '1 month'),
('customer17', '$2b$10$dummy_hash_for_customer17', 'ลูกค้า สมบูรณ์', 'customer17@example.com', '081-444-1127', 3, NOW() - INTERVAL '1 month'),
('customer18', '$2b$10$dummy_hash_for_customer18', 'ลูกค้า สมหวัง', 'customer18@example.com', '081-444-1128', 3, NOW() - INTERVAL '1 month'),
('customer19', '$2b$10$dummy_hash_for_customer19', 'ลูกค้า สมใส', 'customer19@example.com', '081-444-1129', 3, NOW() - INTERVAL '2 weeks'),
('customer20', '$2b$10$dummy_hash_for_customer20', 'ลูกค้า สมศิลป์', 'customer20@example.com', '081-444-1130', 3, NOW() - INTERVAL '1 week');

-- Insert sample menus
INSERT INTO menus (name, description, price, available, created_at) VALUES
('ข้าวผัดกุ้ง', 'ข้าวผัดกุ้งสด เสิร์ฟพร้อมผักดอง', 120.00, true, NOW() - INTERVAL '6 months'),
('ต้มยำกุ้ง', 'ต้มยำกุ้งน้ำข้น รสจัดจ้าน', 150.00, true, NOW() - INTERVAL '6 months'),
('ส้มตำไทย', 'ส้มตำไทยใส่ปู ปลาร้า', 80.00, true, NOW() - INTERVAL '6 months'),
('แกงเขียวหวานไก่', 'แกงเขียวหวานไก่ เข้มข้น หอมหวาน', 130.00, true, NOW() - INTERVAL '5 months'),
('ลาบหมู', 'ลาบหมูสับ รสแซ่บ', 110.00, true, NOW() - INTERVAL '5 months'),
('ผัดไทย', 'ผัดไทยกุ้งสด รสชาติดั้งเดิม', 100.00, true, NOW() - INTERVAL '5 months'),
('มาม่าต้มยำ', 'มาม่าต้มยำพิเศษ ใส่ไข่', 60.00, true, NOW() - INTERVAL '4 months'),
('ข้าวซอยไก่', 'ข้าวซอยไก่ เหนียวนุ่ม', 90.00, true, NOW() - INTERVAL '4 months'),
('แกงส้มปลา', 'แกงส้มปลาชะอม เปรียวหวาน', 120.00, true, NOW() - INTERVAL '3 months'),
('หอยทอด', 'หอยทอดกรรอบ เสิร์ฟร้อนๆ', 140.00, true, NOW() - INTERVAL '3 months');

-- Insert sample orders (distributed over 6 months for analytics)
INSERT INTO orders (user_id, status, created_at) VALUES
-- Month 6 ago (10 orders)
(9, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '1 day'),
(10, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '3 days'),
(11, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '5 days'),
(9, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '8 days'),
(10, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '12 days'),
(11, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '15 days'),
(9, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '18 days'),
(10, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '22 days'),
(11, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '25 days'),
(9, 'completed', NOW() - INTERVAL '6 months' + INTERVAL '28 days'),

-- Month 5 ago (15 orders)
(11, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '2 days'),
(12, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '4 days'),
(13, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '6 days'),
(11, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '8 days'),
(12, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '10 days'),
(13, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '12 days'),
(11, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '14 days'),
(12, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '16 days'),
(13, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '18 days'),
(11, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '20 days'),
(12, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '22 days'),
(13, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '24 days'),
(11, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '26 days'),
(12, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '28 days'),
(13, 'completed', NOW() - INTERVAL '5 months' + INTERVAL '29 days'),

-- Month 4 ago (18 orders)
(14, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '1 day'),
(15, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '2 days'),
(16, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '4 days'),
(14, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '6 days'),
(15, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '7 days'),
(16, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '9 days'),
(14, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '11 days'),
(15, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '13 days'),
(16, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '15 days'),
(14, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '17 days'),
(15, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '19 days'),
(16, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '21 days'),
(14, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '23 days'),
(15, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '25 days'),
(16, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '26 days'),
(14, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '27 days'),
(15, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '28 days'),
(16, 'completed', NOW() - INTERVAL '4 months' + INTERVAL '29 days'),

-- Month 3 ago (22 orders)
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '1 day'),
(18, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '2 days'),
(19, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '3 days'),
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '5 days'),
(18, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '6 days'),
(19, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '8 days'),
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '9 days'),
(18, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '11 days'),
(19, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '12 days'),
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '14 days'),
(18, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '15 days'),
(19, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '17 days'),
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '18 days'),
(18, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '20 days'),
(19, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '21 days'),
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '23 days'),
(18, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '24 days'),
(19, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '26 days'),
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '27 days'),
(18, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '28 days'),
(19, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '29 days'),
(17, 'completed', NOW() - INTERVAL '3 months' + INTERVAL '30 days'),

-- Month 2 ago (25 orders)
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '1 day'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '2 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '3 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '4 days'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '5 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '6 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '7 days'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '8 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '9 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '10 days'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '12 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '13 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '15 days'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '17 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '18 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '19 days'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '20 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '21 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '22 days'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '23 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '24 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '25 days'),
(21, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '26 days'),
(22, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '27 days'),
(20, 'completed', NOW() - INTERVAL '2 months' + INTERVAL '28 days'),

-- Month 1 ago (30 orders)
(23, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '1 day'),
(24, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '2 days'),
(25, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '3 days'),
(26, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '4 days'),
(23, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '5 days'),
(24, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '6 days'),
(25, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '7 days'),
(26, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '8 days'),
(23, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '9 days'),
(24, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '10 days'),
(25, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '11 days'),
(26, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '12 days'),
(23, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '13 days'),
(24, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '14 days'),
(25, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '15 days'),
(26, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '16 days'),
(23, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '17 days'),
(24, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '18 days'),
(25, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '19 days'),
(26, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '20 days'),
(23, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '21 days'),
(24, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '22 days'),
(25, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '23 days'),
(26, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '24 days'),
(23, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '25 days'),
(24, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '26 days'),
(25, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '27 days'),
(26, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '28 days'),
(27, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '29 days'),
(28, 'completed', NOW() - INTERVAL '1 month' + INTERVAL '30 days');

-- Update orders with total amounts
UPDATE orders SET total_amount = 
    CASE 
        WHEN id <= 10 THEN (RANDOM() * 200 + 100)::NUMERIC(10,2)  -- 100-300 range
        WHEN id <= 25 THEN (RANDOM() * 250 + 120)::NUMERIC(10,2)  -- 120-370 range  
        WHEN id <= 43 THEN (RANDOM() * 300 + 150)::NUMERIC(10,2)  -- 150-450 range
        WHEN id <= 65 THEN (RANDOM() * 350 + 180)::NUMERIC(10,2)  -- 180-530 range
        WHEN id <= 90 THEN (RANDOM() * 400 + 200)::NUMERIC(10,2)  -- 200-600 range
        ELSE (RANDOM() * 450 + 220)::NUMERIC(10,2)                -- 220-670 range
    END;

-- Insert sample order_items (simplified - 1-3 items per order)
INSERT INTO order_items (order_id, menu_id, quantity, price) 
SELECT 
    generate_series(1, 120) as order_id,
    (RANDOM() * 9 + 1)::INT as menu_id,
    (RANDOM() * 2 + 1)::INT as quantity,
    m.price
FROM menus m WHERE m.id = (RANDOM() * 9 + 1)::INT
LIMIT 120;

-- Insert payments for completed orders
INSERT INTO payments (order_id, amount, method, status, paid_at, created_at) 
SELECT 
    o.id,
    o.total_amount,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'CASH'
        WHEN RANDOM() < 0.6 THEN 'BANK_TRANSFER' 
        WHEN RANDOM() < 0.85 THEN 'CREDIT_CARD'
        ELSE 'WALLET'
    END as method,
    'completed',
    o.created_at + INTERVAL '5 minutes',
    o.created_at
FROM orders o WHERE o.status = 'completed';
