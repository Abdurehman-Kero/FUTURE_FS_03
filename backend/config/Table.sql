-- Create and use database
CREATE DATABASE IF NOT EXISTS chala_mobile;
USE chala_mobile;

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category ENUM('phone', 'laptop', 'tablet', 'accessory') DEFAULT 'phone',
    type ENUM('new', 'used') DEFAULT 'new',
    brand VARCHAR(100),
    model VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'technician', 'sales') DEFAULT 'technician',
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Repairs Table
CREATE TABLE IF NOT EXISTS repairs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    device_type VARCHAR(100),
    device_brand VARCHAR(100),
    device_model VARCHAR(100),
    issue_description TEXT,
    status ENUM('received', 'diagnosing', 'in_progress', 'completed', 'delivered') DEFAULT 'received',
    technician_id INT,
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (technician_id) REFERENCES staff(id)
);

-- 5. Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_id INT,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'mpesa', 'telebirr', 'bank') DEFAULT 'cash',
    payment_status ENUM('paid', 'pending', 'partial') DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 6. Repair Parts Used Table
CREATE TABLE IF NOT EXISTS repair_parts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    repair_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repair_id) REFERENCES repairs(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 7. Insert Sample Data

-- Sample Staff (password is 'password123' - you'll need to hash this in your app)
INSERT INTO staff (name, role, phone, email, password_hash) VALUES
('John Manager', 'admin', '0912345678', 'john@chalamobile.com', 'temp_hash_change_me'),
('Mike Technician', 'technician', '0923456789', 'mike@chalamobile.com', 'temp_hash_change_me'),
('Sarah Sales', 'sales', '0934567890', 'sarah@chalamobile.com', 'temp_hash_change_me');

-- Sample Products
INSERT INTO products (name, category, type, brand, model, price, stock_quantity, description) VALUES
('iPhone 13', 'phone', 'new', 'Apple', 'iPhone 13 128GB', 89999, 5, 'Brand new iPhone 13, 128GB storage, dual camera'),
('Samsung Galaxy S22', 'phone', 'new', 'Samsung', 'Galaxy S22', 74999, 3, 'Latest Samsung flagship, 128GB storage'),
('iPhone 11', 'phone', 'used', 'Apple', 'iPhone 11 64GB', 35000, 2, 'Good condition, 64GB, minor scratches on back'),
('MacBook Pro', 'laptop', 'used', 'Apple', 'MacBook Pro 2019', 65000, 1, 'Refurbished, 256GB SSD, 8GB RAM, touch bar'),
('Fast Charger', 'accessory', 'new', 'Samsung', '25W Fast Charger', 1500, 20, 'Original Samsung fast charger with cable'),
('Screen Protector', 'accessory', 'new', 'Generic', 'iPhone 13', 300, 50, 'Tempered glass screen protector, 9H hardness'),
('iPhone 12', 'phone', 'used', 'Apple', 'iPhone 12 128GB', 45000, 3, 'Good condition, 128GB, battery health 85%'),
('Tecno Spark 8', 'phone', 'new', 'Tecno', 'Spark 8', 8500, 10, 'Budget friendly smartphone, 64GB storage'),
('Infinix Note 12', 'phone', 'new', 'Infinix', 'Note 12', 12000, 7, 'Large display, 128GB storage, good battery'),
('HP Laptop', 'laptop', 'used', 'HP', 'Pavilion', 28000, 2, 'Used HP Pavilion, i5, 8GB RAM, 256GB SSD'),
('iPhone Charger', 'accessory', 'new', 'Apple', '20W USB-C', 2500, 15, 'Original Apple 20W fast charger'),
('USB Cable', 'accessory', 'new', 'Generic', 'Type-C', 200, 100, 'USB Type-C charging cable, 1 meter'),
('Power Bank', 'accessory', 'new', 'Xiaomi', '20000mAh', 3500, 8, 'Xiaomi power bank, fast charging support'),
('Samsung A13', 'phone', 'new', 'Samsung', 'Galaxy A13', 9500, 6, 'Entry level Samsung, 64GB storage'),
('Bluetooth Speaker', 'accessory', 'new', 'JBL', 'Go 3', 2200, 4, 'Portable Bluetooth speaker, waterproof');

-- Sample Customers
INSERT INTO customers (name, phone, email, address) VALUES
('Abebe Kebede', '0911121314', 'abebe@gmail.com', 'Shashemene, Abosto, near the market'),
('Almaz Tadese', '0922232425', 'almaz@yahoo.com', 'Shashemene, Awasa Road, behind the hotel'),
('Tigist Haile', '0933343536', NULL, 'Shashemene, Kuyera, kebele 03'),
('Bekele Alemu', '0944454647', 'bekele@outlook.com', 'Shashemene, Abosto, main road'),
('Meseret Desta', '0955565758', 'meseret@gmail.com', 'Shashemene, shopping center');

-- Sample Repairs
INSERT INTO repairs (customer_id, device_type, device_brand, device_model, issue_description, status, technician_id, estimated_cost) VALUES
(1, 'phone', 'iPhone', '11', 'Screen cracked, not responding to touch, display shows lines', 'diagnosing', 2, 3500),
(2, 'phone', 'Samsung', 'A12', 'Battery drains quickly, needs replacement', 'received', 2, 1200),
(3, 'laptop', 'HP', 'Pavilion', 'Wont turn on, no power light', 'in_progress', 2, 1800),
(4, 'phone', 'Tecno', 'Spark 8', 'Charging port loose, charges intermittently', 'completed', 2, 800),
(5, 'phone', 'iPhone', '12', 'Water damage, not charging', 'diagnosing', 2, 5000);

-- Sample Sales
INSERT INTO sales (product_id, customer_id, quantity, unit_price, total_amount, payment_method) VALUES
(1, 1, 1, 89999, 89999, 'cash'),
(5, 2, 2, 1500, 3000, 'telebirr'),
(7, 3, 1, 45000, 45000, 'mpesa'),
(8, 4, 1, 8500, 8500, 'cash'),
(11, 5, 2, 2500, 5000, 'telebirr');

-- Sample Repair Parts Used
INSERT INTO repair_parts (repair_id, product_id, quantity, price_at_time) VALUES
(1, 6, 1, 300),  -- Screen protector for repair #1
(4, 11, 1, 2500), -- iPhone charger for repair #4
(2, 5, 1, 1500);  -- Fast charger for repair #2

-- Show all tables
SHOW TABLES;

-- Display counts
SELECT 'products' as table_name, COUNT(*) as row_count FROM products
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'staff', COUNT(*) FROM staff
UNION ALL
SELECT 'repairs', COUNT(*) FROM repairs
UNION ALL
SELECT 'sales', COUNT(*) FROM sales
UNION ALL
SELECT 'repair_parts', COUNT(*) FROM repair_parts;