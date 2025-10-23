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



-- CREATE TABLE IF NOT EXISTS customers (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     customer_id VARCHAR(20) UNIQUE,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100),
--     title VARCHAR(20),
--     email VARCHAR(100) NOT NULL UNIQUE,
--     phone_number VARCHAR(20),
--     primary_number VARCHAR(20),
--     secondary_number VARCHAR(20),
--     date_of_birth DATE,
--     gender VARCHAR(10),
--     nationality VARCHAR(50),
--     address TEXT,
--     city VARCHAR(50),
--     state VARCHAR(50),
--     postal_code VARCHAR(20),
--     address_proof VARCHAR(255), -- Stores file path/URL
--     profile_status VARCHAR(50),

--     -- Financial/Employment Info
--     employment_status VARCHAR(50),
--     company_name VARCHAR(100),
--     job_title VARCHAR(100),
--     monthly_income DECIMAL(10, 2),
--     annual_income DECIMAL(10, 2),
--     income_proof_document VARCHAR(255),
--     credit_score INT, -- Changed to INT as it's typically a number
--     credit_score_band VARCHAR(50),

--     -- KYC/Verification Info
--     govt_id_type VARCHAR(50),
--     govt_id_number VARCHAR(100),
--     id_issue_date DATE,
--     id_expiry_date DATE,
--     id_document_upload VARCHAR(255), -- Stores file path/URL
--     customer_photo VARCHAR(255), -- Stores file path/URL

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- The manual ALTER and UPDATE commands from the original file are removed as they are resolved above.