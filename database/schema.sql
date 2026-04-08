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
    companyName VARCHAR(100),  ==
    jobTitle VARCHAR(100),
    monthlyIncome DECIMAL(10, 2), ===
    annualIncome DECIMAL(10, 2),
    incomeProofDocument VARCHAR(255),
    creditScore VARCHAR(50),
    creditScoreBand VARCHAR(50), ===

    -- KYC/Verification Info
    govtIdType VARCHAR(50),
    govtIdNumber VARCHAR(100),
    idIssueDate DATE,  ===
    idExpiryDate DATE,  ===
    idDocumentUpload VARCHAR(255), -- Stores file path/URL
    customerPhoto VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idDocumentUploadOriginal VARCHAR(255),
    addressProofOriginal VARCHAR(255),
    customerPhotoOriginal VARCHAR(255)
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
    loan_id VARCHAR(20) UNIQUE,
    customer_id VARCHAR(20) NOT NULL,
    loan_amount DECIMAL(10,2) NOT NULL,
    loan_purpose VARCHAR(100) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    loan_term INT NOT NULL,
    application_date DATE,
    status_approved ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE') DEFAULT 'PENDING',
    monthly_payment DECIMAL(10,2),
    next_payment_due DATE,
    remaining_balance DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT ON UPDATE CASCADE
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


INSERT INTO customers (
    customer_id, firstName, lastName, title, email, phoneNumber, primaryNumber, secondaryNumber,
    dateOfBirth, gender, nationality, address, city, state, postalCode, addressProof, profileStatus,
    employmentStatus, jobTitle, annualIncome, incomeProofDocument, creditScore,
    govtIdType, govtIdNumber, idDocumentUpload, customerPhoto, created_at,
    idDocumentUploadOriginal, addressProofOriginal, customerPhotoOriginal
) VALUES
('CUST1030','John','Doe','Mr','john.doe@example.com','9876543210','9123456789','9988776655','1990-05-12','Male','American','123 Main St','New York','New York','10001','addr_doc1.png','Active','Employed','Engineer',75000.00,'Pay Slips','Excellent (750-850)','Passport','P123456789','id_doc1.pdf','photo1.jpg','2026-03-31 10:00:00','id_doc1_orig.pdf','addr_doc1_orig.png','photo1_orig.jpg'),

('CUST1031','Emily','Smith','Ms','emily.smith@example.com','8765432109','9234567890','8877665544','1985-11-23','Female','Canadian','456 Oak Ave','Los Angeles','California','90001','addr_doc2.png','Inactive','Self-Employed','Designer',55000.00,'Bank Statements','Good (700-749)','Driver\'s License','DL987654321','id_doc2.pdf','photo2.jpg','2026-03-31 11:00:00','id_doc2_orig.pdf','addr_doc2_orig.png','photo2_orig.jpg'),

('CUST1032','Michael','Brown','Dr','michael.brown@example.com','7654321098','9345678901','7766554433','1978-07-19','Male','British','789 Pine Rd','Chicago','Illinois','60601','addr_doc3.png','OnHold','Employed','Doctor',120000.00,'Tax Return','Fair (650-699)','National ID','NID123456789','id_doc3.pdf','photo3.jpg','2026-03-31 12:00:00','id_doc3_orig.pdf','addr_doc3_orig.png','photo3_orig.jpg'),

('CUST1033','Sophia','Johnson','Mrs','sophia.johnson@example.com','6543210987','9456789012','6655443322','1992-02-05','Female','Indian','321 Maple St','Houston','Texas','77001','addr_doc4.png','Active','Student','Graduate Student',15000.00,'Pay Slips','Poor (600-649)','Voter ID','VID987654321','id_doc4.pdf','photo4.jpg','2026-03-31 13:00:00','id_doc4_orig.pdf','addr_doc4_orig.png','photo4_orig.jpg'),

('CUST1034','David','Williams','Mr','david.williams@example.com','5432109876','9567890123','5544332211','1988-09-14','Male','Australian','654 Cedar Blvd','Miami','Florida','33101','addr_doc5.png','Inactive','Retired','Teacher',30000.00,'Bank Statements','Very Poor (<600)','Passport','P987654321','id_doc5.pdf','photo5.jpg','2026-03-31 14:00:00','id_doc5_orig.pdf','addr_doc5_orig.png','photo5_orig.jpg'),

('CUST1035','Olivia','Taylor','Ms','olivia.taylor@example.com','4321098765','9678901234','4433221100','1995-12-30','Female','American','987 Birch Ln','New York','New York','10002','addr_doc6.png','Active','Employed','Analyst',65000.00,'Tax Return','Good (700-749)','Driver\'s License','DL123987456','id_doc6.pdf','photo6.jpg','2026-03-31 15:00:00','id_doc6_orig.pdf','addr_doc6_orig.png','photo6_orig.jpg'),

('CUST1036','James','Anderson','Mr','james.anderson@example.com','3210987654','9789012345','3322110099','1982-04-21','Male','American','246 Elm St','Los Angeles','California','90002','addr_doc7.png','OnHold','Self-Employed','Consultant',85000.00,'Bank Statements','Excellent (750-850)','National ID','NID654321987','id_doc7.pdf','photo7.jpg','2026-03-31 16:00:00','id_doc7_orig.pdf','addr_doc7_orig.png','photo7_orig.jpg'),

('CUST1037','Isabella','Martinez','Mrs','isabella.martinez@example.com','2109876543','9890123456','2211009988','1998-08-10','Female','Mexican','135 Willow Dr','Chicago','Illinois','60602','addr_doc8.png','Active','Employed','Nurse',48000.00,'Pay Slips','Fair (650-699)','Voter ID','VID654987321','id_doc8.pdf','photo8.jpg','2026-03-31 17:00:00','id_doc8_orig.pdf','addr_doc8_orig.png','photo8_orig.jpg'),

('CUST1038','William','Garcia','Dr','william.garcia@example.com','1098765432','9901234567','1100998877','1975-03-03','Male','Spanish','864 Spruce Ct','Houston','Texas','77002','addr_doc9.png','Inactive','Unemployed','None',0.00,'Tax Return','Very Poor (<600)','Passport','P654321987','id_doc9.pdf','photo9.jpg','2026-03-31 18:00:00','id_doc9_orig.pdf','addr_doc9_orig.png','photo9_orig.jpg'),

('CUST1039','Mia','Hernandez','Ms','mia.hernandez@example.com','9988776655','9012345678','0099887766','1993-06-25','Female','American','753 Aspen Way','Miami','Florida','33102','addr_doc10.png','Active','Employed','Developer',95000.00,'Pay Slips','Excellent (750-850)','Driver\'s License','DL789456123','id_doc10.pdf','photo10.jpg','2026-03-31 19:00:00','id_doc10_orig.pdf','addr_doc10_orig.png','photo10_orig.jpg');



INSERT INTO loan_customer (
    loan_id, loan_amount, loan_purpose, interest_rate, loan_term,
    application_date, status_approved, monthly_payment, next_payment_due,
    remaining_balance, created_at, customer_id
) VALUES
('USR1020', 50000.00, 'Home', 6.50, 60, '2026-03-25', 'APPROVED', 1200.00, '2026-04-25', 48000.00, '2026-03-31 10:00:00', 'CUST1030'),
('USR1021', 15000.00, 'Educational', 4.00, 24, '2026-03-28', 'PENDING', 650.00, '2026-04-15', 14200.00, '2026-03-31 10:30:00', 'CUST1031'),
('USR1022', 75000.00, 'Gold', 8.00, 36, '2026-03-29', 'ACTIVE', 2500.00, '2026-04-20', 72000.00, '2026-03-31 11:00:00', 'CUST1032'),
('USR1023', 20000.00, 'Personal', 10.00, 12, '2026-03-30', 'REJECTED', 1800.00, '2026-04-10', 19500.00, '2026-03-31 11:30:00', 'CUST1033'),
('USR1024', 100000.00, 'Home', 7.25, 120, '2026-03-31', 'APPROVED', 1100.00, '2026-04-30', 98500.00, '2026-03-31 12:00:00', 'CUST1034'),
('USR1025', 30000.00, 'Educational', 5.00, 36, '2026-03-27', 'ACTIVE', 950.00, '2026-04-18', 28900.00, '2026-03-31 12:30:00', 'CUST1035'),
('USR1026', 45000.00, 'Gold', 9.00, 24, '2026-03-26', 'PENDING', 2100.00, '2026-04-12', 44000.00, '2026-03-31 13:00:00', 'CUST1036'),
('USR1027', 12000.00, 'Personal', 11.00, 12, '2026-03-29', 'APPROVED', 1100.00, '2026-04-09', 11800.00, '2026-03-31 13:30:00', 'CUST1037'),
('USR1028', 60000.00, 'Home', 6.00, 60, '2026-03-30', 'ACTIVE', 1300.00, '2026-04-25', 59000.00, '2026-03-31 14:00:00', 'CUST1038'),
('USR1029', 25000.00, 'Educational', 4.50, 24, '2026-03-31', 'REJECTED', 1050.00, '2026-04-15', 24500.00, '2026-03-31 14:30:00', 'CUST1039');
