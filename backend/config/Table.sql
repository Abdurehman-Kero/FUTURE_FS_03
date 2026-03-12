-- Products table (for phones & PCs)
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    category ENUM('phone', 'laptop', 'accessory'),
    condition ENUM('new', 'used'),
    brand VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INT,
    description TEXT,
    created_at TIMESTAMP
);

-- Repairs table
CREATE TABLE repairs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    device_type VARCHAR(100),
    device_brand VARCHAR(100),
    issue_description TEXT,
    status ENUM('received', 'in_progress', 'completed', 'delivered'),
    technician_id INT,
    fee DECIMAL(10,2),
    created_at TIMESTAMP
);

-- Staff table
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    role ENUM('admin', 'technician', 'sales'),
    phone VARCHAR(20),
    email VARCHAR(255),
    password_hash VARCHAR(255)
);

-- Sales table
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    quantity INT,
    total_amount DECIMAL(10,2),
    payment_method ENUM('cash', 'mpesa', 'telebirr'),
    customer_id INT,
    created_at TIMESTAMP
);