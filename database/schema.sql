CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'manager', 'recovery_agent') DEFAULT 'manager'
);

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10, 2),
    interest_rate DECIMAL(5, 2),
    tenure_months INT,
    start_date DATE,
    status ENUM('pending', 'approved', 'rejected', 'closed') DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
