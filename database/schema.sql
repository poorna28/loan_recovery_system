CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(20) UNIQUE,
  firstName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  PhoneNumber VARCHAR(20),
  dateOfBirth DATE,
  address TEXT,
  EmploymentStatus VARCHAR(50),
  AnnualIncome VARCHAR(50),
  creditScore VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE customers ADD COLUMN customer_id VARCHAR(20) UNIQUE AFTER id;

UPDATE users SET password = 'your_bcrypt_hash' WHERE email = 'user@example.com';

