CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100),
    title VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE,
    phoneNumber VARCHAR(20),
    primaryNumber VARCHAR(20),
    secondaryNumber VARCHAR(20),
    dateOfBirth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    postalCode VARCHAR(20),
    addressProof VARCHAR(255), -- Stores file path/URL
    profileStatus VARCHAR(50),

    -- Financial/Employment Info
    employmentStatus VARCHAR(50),
    companyName VARCHAR(100),
    jobTitle VARCHAR(100),
    monthlyIncome DECIMAL(10, 2),
    annualIncome DECIMAL(10, 2),
    incomeProofDocument VARCHAR(255),
    creditScore VARCHAR(50),
    creditScoreBand VARCHAR(50),

    -- KYC/Verification Info
    govtIdType VARCHAR(50),
    govtIdNumber VARCHAR(100),
    idIssueDate DATE,
    idExpiryDate DATE,
    idDocumentUpload VARCHAR(255), -- Stores file path/URL
    customerPhoto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE customers
ADD COLUMN idDocumentUploadOriginal VARCHAR(255),
ADD COLUMN addressProofOriginal VARCHAR(255),
ADD COLUMN customerPhotoOriginal VARCHAR(255);


ALTER TABLE customers ADD COLUMN customer_id VARCHAR(20) UNIQUE AFTER id;

UPDATE users SET password = 'your_bcrypt_hash' WHERE email = 'user@example.com';



-- CREATE TABLE IF NOT EXISTS customers (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     customer_id VARCHAR(20) UNIQUE,
--     firstName VARCHAR(100) NOT NULL,
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



-- CREATE TABLE loanCustomer (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     loan_id VARCHAR(20) UNIQUE,
--     loanAmount DECIMAL(10,2) NOT NULL,
--     loanPurpose VARCHAR(100) NOT NULL,
--     interestRate DECIMAL(5,2) NOT NULL,
--     loanTerm INT NOT NULL,
--     aplicationDate DATE,
--     statusApproved ENUM('Approved', 'Not Approved', 'Pending') DEFAULT 'Pending',
--     monthlyPayment DECIMAL(10,2),
--     nextPaymentDue DATE,
--     remainingBalance DECIMAL(10,2),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE loan_customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    loan_id VARCHAR(20) UNIQUE,
    loan_amount DECIMAL(10,2) NOT NULL,
    loan_purpose VARCHAR(100) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    loan_term INT NOT NULL,
    application_date DATE,
    status_approved ENUM('Approved', 'Not Approved', 'Pending') DEFAULT 'Pending',
    monthly_payment DECIMAL(10,2),
    next_payment_due DATE,
    remaining_balance DECIMAL(10,2),
);

-- PART 1 — SQL (Customer list with loan count)
SELECT 
  c.customer_id,
  c.firstName,
  c.lastName,
  c.email,
  c.phoneNumber,
  COUNT(l.id) AS loan_count
FROM customers c
LEFT JOIN loan_customer l
  ON c.customer_id = l.customer_id
GROUP BY 
  c.customer_id,
  c.firstName,
  c.lastName,
  c.email,
  c.phoneNumber;



CREATE TABLE loan_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_customer_id INT,
    loan_id VARCHAR(20),
    amount_paid DECIMAL(10,2),
    payment_date DATE,
    payment_method VARCHAR(50),
    principal_component DECIMAL(10,2),
    interest_component DECIMAL(10,2),
    remaining_balance DECIMAL(10,2)
);
