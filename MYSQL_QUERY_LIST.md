# Complete MySQL Query List - Loan Recovery System
## From Login to Reports: All CRUD Operations

**Generated:** April 8, 2026  
**Database:** loan_recovery_system  
**Organized by:** User Flow (Login → Customers → Loans → Payments → Reports → Dashboard)

---

## 📋 TABLE OF CONTENTS

1. [AUTH & USER MANAGEMENT](#auth--user-management)
2. [CUSTOMER MANAGEMENT](#customer-management)
3. [LOAN MANAGEMENT](#loan-management)
4. [PAYMENT MANAGEMENT](#payment-management)
5. [REPORTS & ANALYTICS](#reports--analytics)
6. [DASHBOARD](#dashboard)

---

---

## 🔐 AUTH & USER MANAGEMENT

### 1. FIND USER BY EMAIL (Login Check)
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/userModel.js`  
**Purpose:** Check if user exists during login

```sql
SELECT * FROM users WHERE email = ?
```

**Parameters:** `[email]`  
**Example:**
```sql
SELECT * FROM users WHERE email = 'admin@example.com'
```

**Returns:**
- id, name, email, password (hashed)

---

### 2. CREATE NEW USER (Register)
**Type:** INSERT | **Operation:** CREATE  
**File:** `server/models/userModel.js`  
**Purpose:** Register a new user account

```sql
INSERT INTO users (name, email, password) VALUES (?, ?, ?)
```

**Parameters:** `[name, email, hashedPassword]`  
**Example:**
```sql
INSERT INTO users (name, email, password) 
VALUES ('John Admin', 'john@example.com', '$2b$10$hashed_password_here')
```

**Returns:**
- insertId, affectedRows

---

---

## 👥 CUSTOMER MANAGEMENT

### 3. CREATE CUSTOMER
**Type:** INSERT | **Operation:** CREATE  
**File:** `server/models/customerModel.js`  
**Purpose:** Create new customer record with documents and verification data

```sql
INSERT INTO customers (
  firstName, lastName, title, email, phoneNumber, primaryNumber, secondaryNumber,
  dateOfBirth, gender, nationality, address, city, state, postalCode, profileStatus,
  employmentStatus, jobTitle, annualIncome, incomeProofDocument,
  creditScore, govtIdType, govtIdNumber,
  addressProof, idDocumentUpload, customerPhoto,
  idDocumentUploadOriginal, addressProofOriginal, customerPhotoOriginal
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
```

**Parameters:**
```
[
  firstName, lastName, title, email, phoneNumber, primaryNumber, secondaryNumber,
  dateOfBirth, gender, nationality, address, city, state, postalCode, profileStatus,
  employmentStatus, jobTitle, annualIncome, incomeProofDocument,
  creditScore, govtIdType, govtIdNumber,
  addressProof, idDocumentUpload, customerPhoto,
  idDocumentUploadOriginal, addressProofOriginal, customerPhotoOriginal
]
```

**Example:**
```sql
INSERT INTO customers 
(firstName, lastName, email, phoneNumber, profileStatus, employmentStatus) 
VALUES ('Rajesh', 'Kumar', 'rajesh@email.com', '9876543210', 'Active', 'Employed')
```

**After Insert:**
```sql
UPDATE customers SET customer_id = ? WHERE id = ?
```
**Parameters:** `[generatedCustomerId, insertId]`  
**Example:**
```sql
UPDATE customers SET customer_id = 'CUST1001' WHERE id = 1
```

**Returns:**
- id (primary key)
- customer_id (generated: CUST1000+id)

---

### 4. GET ALL CUSTOMERS
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/customerModel.js`  
**Purpose:** Retrieve all customer records

```sql
SELECT * FROM customers
```

**Returns:** All customer records with all fields

---

### 5. GET CUSTOMER BY ID
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/customerModel.js`  
**Purpose:** Get single customer details

```sql
SELECT * FROM customers WHERE customer_id = ?
```

**Parameters:** `[customer_id]`  
**Example:**
```sql
SELECT * FROM customers WHERE customer_id = 'CUST1001'
```

**Returns:** Single customer record

---

### 6. GET CUSTOMERS WITH LOAN COUNT
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/customerModel.js`  
**Purpose:** Get customers with their loan count and details

```sql
SELECT 
  c.customer_id,
  c.firstName,
  c.lastName,
  c.email,
  c.phoneNumber,
  c.employmentStatus,
  c.profileStatus,
  c.annualIncome,
  c.creditScore,
  COUNT(l.id) AS loan_count
FROM customers c
LEFT JOIN loan_customer l ON c.customer_id = l.customer_id
GROUP BY 
  c.customer_id,
  c.firstName,
  c.lastName,
  c.email,
  c.phoneNumber,
  c.employmentStatus,
  c.profileStatus,
  c.annualIncome,
  c.creditScore
```

**Returns:** Each customer with their total loan count

---

### 7. UPDATE CUSTOMER
**Type:** UPDATE | **Operation:** UPDATE  
**File:** `server/models/customerModel.js`  
**Purpose:** Update customer profile and documents

```sql
UPDATE customers SET
  firstName=?, lastName=?, title=?, email=?, phoneNumber=?, primaryNumber=?, secondaryNumber=?,
  dateOfBirth=?, gender=?, nationality=?, address=?, city=?, state=?, postalCode=?, profileStatus=?,
  employmentStatus=?, jobTitle=?, annualIncome=?, incomeProofDocument=?,
  creditScore=?, govtIdType=?, govtIdNumber=?,
  addressProof=?, idDocumentUpload=?, customerPhoto=?,
  idDocumentUploadOriginal=?, addressProofOriginal=?, customerPhotoOriginal=?
WHERE customer_id=?
```

**Parameters:** `[...updatedValues, customer_id]`

**Returns:** affectedRows

---

### 8. DELETE CUSTOMER
**Type:** DELETE | **Operation:** DELETE  
**File:** `server/models/customerModel.js`  
**Purpose:** Remove customer record

```sql
DELETE FROM customers WHERE customer_id = ?
```

**Parameters:** `[customer_id]`  
**Example:**
```sql
DELETE FROM customers WHERE customer_id = 'CUST1001'
```

**Returns:** affectedRows

---

---

## 💰 LOAN MANAGEMENT

### 9. CREATE LOAN
**Type:** INSERT | **Operation:** CREATE  
**File:** `server/models/loanModel.js`  
**Purpose:** Create new loan for a customer

```sql
INSERT INTO loan_customer (
  customer_id,
  loan_amount,
  loan_purpose,
  interest_rate,
  loan_term,
  application_date,
  status_approved,
  monthly_payment,
  next_payment_due,
  remaining_balance
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

**Parameters:**
```
[
  customer_id,
  loan_amount,      // e.g., 500000
  loan_purpose,     // e.g., "Home Purchase"
  interest_rate,    // e.g., 8.5
  loan_term,        // months, e.g., 60
  application_date, // YYYY-MM-DD
  status_approved,  // PENDING/APPROVED/REJECTED/ACTIVE
  monthly_payment,  // calculated EMI
  next_payment_due, // YYYY-MM-DD
  remaining_balance // equals loan_amount initially
]
```

**Example:**
```sql
INSERT INTO loan_customer 
(customer_id, loan_amount, loan_purpose, interest_rate, loan_term, 
 application_date, status_approved, monthly_payment, next_payment_due, remaining_balance)
VALUES ('CUST1001', 500000, 'Home', 8.5, 60, '2024-01-15', 'PENDING', 11000, NULL, 500000)
```

**After Insert:**
```sql
UPDATE loan_customer SET loan_id = ? WHERE id = ?
```
**Parameters:** `[generatedLoanId, insertId]`  
**Example:**
```sql
UPDATE loan_customer SET loan_id = 'USR1001' WHERE id = 1
```

**Returns:**
- id (primary key)
- loan_id (generated: USR1000+id)

---

### 10. GET ALL LOANS
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/loanModel.js`  
**Purpose:** Retrieve all loan records

```sql
SELECT * FROM loan_customer
```

**Returns:** All loan records

---

### 11. GET LOAN BY ID
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/loanModel.js`  
**Purpose:** Get specific loan details

```sql
SELECT * FROM loan_customer WHERE id = ?
```

**Parameters:** `[loan_id]`

**Returns:** Single loan record

---

### 12. GET LOANS BY CUSTOMER ID
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/loanModel.js`  
**Purpose:** Get all loans for a specific customer

```sql
SELECT * FROM loan_customer WHERE customer_id = ?
```

**Parameters:** `[customer_id]`

**Returns:** All loans for the customer

---

### 13. UPDATE LOAN
**Type:** UPDATE | **Operation:** UPDATE  
**File:** `server/models/loanModel.js`  
**Purpose:** Update loan details (amount, term, interest rate, etc.)

```sql
UPDATE loan_customer SET
  customer_id       = ?,
  loan_amount       = ?,
  loan_purpose      = ?,
  interest_rate     = ?,
  loan_term         = ?,
  application_date  = ?,
  status_approved   = COALESCE(?, status_approved),
  monthly_payment   = ?,
  next_payment_due  = ?,
  remaining_balance = ?
WHERE id = ?
```

**Parameters:** `[customer_id, loan_amount, loan_purpose, interest_rate, loan_term, application_date, status_approved, monthly_payment, next_payment_due, remaining_balance, id]`

**Returns:** affectedRows

---

### 14. UPDATE LOAN STATUS
**Type:** UPDATE | **Operation:** UPDATE  
**File:** `server/models/loanModel.js`  
**Purpose:** Update only the status (PENDING → APPROVED → ACTIVE, etc.)

```sql
UPDATE loan_customer SET status_approved = ? WHERE id = ?
```

**Parameters:** `[status, loan_id]`  
**Example:**
```sql
UPDATE loan_customer SET status_approved = 'APPROVED' WHERE id = 1
```

**Status Values:** PENDING, APPROVED, REJECTED, ACTIVE

**Returns:** affectedRows

---

### 15. ACTIVATE LOAN (Auto-Calculate EMI)
**Type:** SELECT + UPDATE | **Operation:** READ + UPDATE  
**File:** `server/models/loanModel.js`  
**Purpose:** Activate loan and automatically calculate EMI, remaining balance, next payment due

**Step 1 - Get Loan Details:**
```sql
SELECT loan_amount, interest_rate, loan_term, status_approved
FROM loan_customer WHERE id = ?
```

**Parameters:** `[loan_id]`

**Step 2 - Calculate EMI (in application code):**
Formula: `EMI = (P × r × (1 + r)^n) / ((1 + r)^n - 1)`  
where P = Principal, r = monthly rate, n = number of months

**Step 3 - Update Loan with EMI:**
```sql
UPDATE loan_customer SET
  status_approved   = 'ACTIVE',
  monthly_payment   = ?,
  remaining_balance = ?,
  next_payment_due  = ?
WHERE id = ?
```

**Parameters:** `[calculated_emi, loan_amount, next_payment_due, loan_id]`  
**Example:**
```sql
UPDATE loan_customer SET
  status_approved   = 'ACTIVE',
  monthly_payment   = 11000,
  remaining_balance = 500000,
  next_payment_due  = '2024-02-15'
WHERE id = 1
```

**Returns:** affectedRows

---

### 16. DELETE LOAN
**Type:** DELETE | **Operation:** DELETE  
**File:** `server/models/loanModel.js`  
**Purpose:** Remove loan record

```sql
DELETE FROM loan_customer WHERE id = ?
```

**Parameters:** `[loan_id]`

**Returns:** affectedRows

---

---

## 💳 PAYMENT MANAGEMENT

### 17. MAKE PAYMENT (With Transaction)
**Type:** TRANSACTION (SELECT + INSERT + UPDATE) | **Operation:** CREATE + UPDATE  
**File:** `server/models/paymentModel.js`  
**Purpose:** Process payment with atomic transaction (ensures consistency)

**Phase 1 - Start Transaction:**
```sql
START TRANSACTION
```

**Phase 2 - Get Loan Details:**
```sql
SELECT id, loan_id, interest_rate, remaining_balance, status_approved, loan_term, monthly_payment
FROM loan_customer WHERE id = ?
```

**Parameters:** `[loan_id]`

**Phase 3 - Insert Payment Record:**
```sql
INSERT INTO loan_payments
(loan_customer_id, loan_id, amount_paid, payment_date,
 payment_method, principal_component, interest_component, remaining_balance)
VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)
```

**Parameters:**
```
[
  loan_id (primary key),
  loan_id (loan identifier),
  payment_amount,
  payment_method,              // CASH, CHECK, TRANSFER, CARD, ONLINE
  calculated_principal_component,
  calculated_interest_component,
  updated_remaining_balance
]
```

**Example:**
```sql
INSERT INTO loan_payments
(loan_customer_id, loan_id, amount_paid, payment_date, payment_method, 
 principal_component, interest_component, remaining_balance)
VALUES (1, 'USR1001', 11000, CURDATE(), 'ONLINE', 8500, 2500, 489000)
```

**Phase 4 - Update Loan Remaining Balance:**
```sql
UPDATE loan_customer SET
  remaining_balance = ?,
  next_payment_due = ?
WHERE id = ?
```

**Parameters:** `[new_remaining_balance, new_next_payment_due, loan_id]`

**Phase 5 - Commit Transaction:**
```sql
COMMIT
```

**On Error - Rollback:**
```sql
ROLLBACK
```

**Returns:** Payment details with principal and interest breakdown

---

### 18. GET ALL PAYMENTS
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/paymentModel.js`  
**Purpose:** Retrieve all payment records

```sql
SELECT * FROM loan_payments ORDER BY payment_date DESC
```

**Returns:** All payments, latest first

---

### 19. DELETE PAYMENT
**Type:** DELETE | **Operation:** DELETE  
**File:** `server/models/paymentModel.js`  
**Purpose:** Remove payment record (with existence check)

```sql
DELETE FROM loan_payments WHERE id = ?
```

**Parameters:** `[payment_id]`

**Returns:** affectedRows (0 if not found)

---

---

## 📊 REPORTS & ANALYTICS

### REPORT 1: LOAN SUMMARY

#### 20. Get Loan Summary KPIs
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get KPIs for loan summary tab

```sql
SELECT
  COUNT(*)                                                        AS total_loans,
  COALESCE(SUM(loan_amount), 0)                                   AS total_issued,
  COUNT(CASE WHEN status_approved = 'ACTIVE'   THEN 1 END)       AS active_loans,
  COUNT(CASE WHEN status_approved = 'APPROVED' THEN 1 END)       AS approved_loans,
  COUNT(CASE WHEN status_approved = 'PENDING'  THEN 1 END)       AS pending_loans,
  COUNT(CASE WHEN status_approved = 'REJECTED' THEN 1 END)       AS rejected_loans,
  COALESCE(SUM(CASE WHEN status_approved = 'ACTIVE' THEN remaining_balance END), 0) AS outstanding
FROM loan_customer
```

**Returns:**
- total_loans, total_issued, active_loans, approved_loans, pending_loans, rejected_loans, outstanding

---

#### 21. Get All Loans with Customer Info (With Pagination)
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get paginated list of all loans with customer details

```sql
SELECT
  lc.id,
  lc.loan_id,
  lc.loan_amount,
  lc.loan_purpose,
  lc.interest_rate,
  lc.loan_term,
  DATE_FORMAT(lc.application_date, '%d %b %Y') AS application_date,
  lc.status_approved,
  lc.monthly_payment,
  lc.next_payment_due,
  lc.remaining_balance,
  lc.customer_id,
  CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name
FROM loan_customer lc
LEFT JOIN customers c ON c.customer_id = lc.customer_id
ORDER BY lc.id DESC
LIMIT 100
```

**Returns:** 100 most recent loans with customer info

---

#### 22. Get Loan Status Breakdown
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Count loans by status

```sql
SELECT status_approved AS status, COUNT(*) AS count
FROM loan_customer
GROUP BY status_approved
```

**Returns:** Count of loans per status (ACTIVE, PENDING, APPROVED, REJECTED)

---

#### 23. Get Monthly Disbursement (Last 6 Months)
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get monthly loan disbursement trend

```sql
SELECT
  DATE_FORMAT(application_date, '%b %Y') AS month,
  COUNT(*)                               AS count,
  COALESCE(SUM(loan_amount), 0)          AS total_amount
FROM loan_customer
WHERE application_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(application_date, '%Y-%m'), DATE_FORMAT(application_date, '%b %Y')
ORDER BY MIN(application_date)
```

**Returns:** Monthly disbursement trend data

---

### REPORT 2: PAYMENTS

#### 24. Get Payment KPIs
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get metrics for payments tab

```sql
SELECT
  COALESCE(SUM(p.amount_paid), 0)                              AS total_collected,
  COUNT(p.id)                                                  AS total_transactions,
  COALESCE(AVG(p.amount_paid), 0)                             AS avg_payment,
  COUNT(CASE WHEN lc.status_approved = 'ACTIVE'
              AND lc.next_payment_due < CURDATE() THEN 1 END) AS missed_emis
FROM loan_payments p
RIGHT JOIN loan_customer lc ON lc.id = p.loan_customer_id
```

**Returns:**
- total_collected, total_transactions, avg_payment, missed_emis

---

#### 25. Get All Payments with Customer Info (With Pagination)
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get paginated list of payments with breakdown

```sql
SELECT
  p.id,
  p.loan_id,
  p.amount_paid,
  DATE_FORMAT(p.payment_date, '%d %b %Y') AS payment_date,
  p.payment_method,
  p.principal_component,
  p.interest_component,
  p.remaining_balance,
  CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name
FROM loan_payments p
LEFT JOIN loan_customer lc ON lc.id = p.loan_customer_id
LEFT JOIN customers c ON c.customer_id = lc.customer_id
ORDER BY p.payment_date DESC
LIMIT 100
```

**Returns:** 100 most recent payments with breakdown

---

### REPORT 3: OVERDUE LOANS

#### 26. Get Overdue KPIs
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get metrics for overdue loans

```sql
SELECT
  COUNT(*)                                                              AS total_overdue,
  COALESCE(SUM(remaining_balance), 0)                                  AS at_risk_amount,
  COUNT(CASE WHEN DATEDIFF(CURDATE(), next_payment_due) >= 30 THEN 1 END) AS over_30,
  COUNT(CASE WHEN DATEDIFF(CURDATE(), next_payment_due) >= 90 THEN 1 END) AS over_90
FROM loan_customer
WHERE status_approved = 'ACTIVE'
  AND next_payment_due < CURDATE()
```

**Returns:**
- total_overdue, at_risk_amount, over_30, over_90

---

#### 27. Get Overdue Loans with Customer Info (With Pagination)
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get list of overdue loans with severity

```sql
SELECT
  lc.id,
  lc.loan_id,
  lc.remaining_balance,
  DATE_FORMAT(lc.next_payment_due, '%d %b %Y') AS next_payment_due,
  lc.monthly_payment,
  DATEDIFF(CURDATE(), lc.next_payment_due)     AS days_overdue,
  CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name,
  c.phoneNumber AS phone
FROM loan_customer lc
LEFT JOIN customers c ON c.customer_id = lc.customer_id
WHERE lc.status_approved = 'ACTIVE'
  AND lc.next_payment_due < CURDATE()
ORDER BY days_overdue DESC
LIMIT 100
```

**Returns:** Overdue loans sorted by severity (days overdue)

---

### REPORT 4: CUSTOMER WISE ANALYSIS

#### 28. Get Customer Summary KPIs
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get customer health metrics

```sql
SELECT
  COUNT(DISTINCT c.customer_id)                                       AS total_customers,
  COUNT(DISTINCT CASE WHEN lc.status_approved NOT IN ('ACTIVE') OR lc.next_payment_due >= CURDATE() OR lc.next_payment_due IS NULL
                      THEN c.customer_id END)                         AS good_standing,
  COUNT(DISTINCT CASE WHEN lc.status_approved = 'ACTIVE'
                       AND lc.next_payment_due < CURDATE()
                      THEN c.customer_id END)                         AS defaulters
FROM customers c
LEFT JOIN loan_customer lc ON lc.customer_id = c.customer_id
```

**Returns:**
- total_customers, good_standing, defaulters

---

#### 29. Get Customer-Wise Report (With Pagination)
**Type:** SELECT | **Operation:** READ  
**File:** `server/models/reportmodel.js`  
**Purpose:** Get detailed customer performance metrics

```sql
SELECT
  c.customer_id,
  CONCAT(COALESCE(c.firstName, ''), ' ', COALESCE(c.lastName, '')) AS customer_name,
  c.phoneNumber                                                      AS phone,
  COUNT(lc.id)                                                       AS total_loans,
  COALESCE(SUM(lc.loan_amount), 0)                                   AS total_principal,
  COALESCE(SUM(lc.loan_amount - lc.remaining_balance), 0)           AS total_paid,
  COALESCE(SUM(lc.remaining_balance), 0)                            AS pending_amount,
  CASE
    WHEN SUM(lc.loan_amount) > 0
    THEN ROUND(
      SUM(lc.loan_amount - lc.remaining_balance) / SUM(lc.loan_amount) * 100, 1
    )
    ELSE 0
  END                                                                AS collection_pct,
  MAX(lc.status_approved)                                            AS status
FROM customers c
LEFT JOIN loan_customer lc ON lc.customer_id = c.customer_id
GROUP BY c.customer_id, c.firstName, c.lastName, c.phoneNumber
ORDER BY pending_amount DESC
LIMIT 100
```

**Returns:** Customer performance with collection percentage

---

---

## 📈 DASHBOARD (Real-Time Summary)

### 30. Dashboard KPI Cards
**Type:** SELECT | **Operation:** READ  
**File:** `server/controllers/dashboardController.js`  
**Purpose:** Get all dashboard metrics (5 cards)

```sql
SELECT
  (SELECT COUNT(*) FROM customers)                               AS total_customers,
  (SELECT COUNT(*) FROM loan_customer)                           AS total_loans,
  (SELECT COALESCE(SUM(amount_paid), 0) FROM loan_payments)     AS total_collected,
  (SELECT COALESCE(SUM(remaining_balance), 0)
   FROM loan_customer WHERE status_approved = 'ACTIVE')         AS total_pending,
  (SELECT COUNT(*) FROM loan_customer
   WHERE status_approved = 'ACTIVE')                            AS active_loans,
  (SELECT COUNT(*) FROM loan_customer
   WHERE status_approved = 'ACTIVE'
     AND next_payment_due < CURDATE())                          AS overdue_count
```

**Returns:**
- total_customers, total_loans, total_collected, total_pending, active_loans, overdue_count

---

### 31. Recent Payments Activity (Last 5)
**Type:** SELECT | **Operation:** READ  
**File:** `server/controllers/dashboardController.js`  
**Purpose:** Show recent payment activity

```sql
SELECT
  p.id,
  p.loan_id,
  p.amount_paid,
  p.payment_method,
  DATE_FORMAT(p.payment_date, '%d %b %Y')                      AS payment_date,
  TIMESTAMPDIFF(MINUTE, p.payment_date, NOW())                  AS minutes_ago,
  CONCAT(COALESCE(c.firstName,''), ' ', COALESCE(c.lastName,'')) AS customer_name
FROM loan_payments p
LEFT JOIN loan_customer lc ON lc.id = p.loan_customer_id
LEFT JOIN customers c      ON c.customer_id = lc.customer_id
ORDER BY p.payment_date DESC
LIMIT 5
```

**Returns:** 5 most recent payments with time elapsed

---

### 32. Overdue Alerts (Top 5 Critical)
**Type:** SELECT | **Operation:** READ  
**File:** `server/controllers/dashboardController.js`  
**Purpose:** Show most critical overdue loans

```sql
SELECT
  lc.loan_id,
  lc.remaining_balance,
  DATEDIFF(CURDATE(), lc.next_payment_due)                      AS days_overdue,
  DATE_FORMAT(lc.next_payment_due, '%d %b %Y')                  AS due_date,
  CONCAT(COALESCE(c.firstName,''), ' ', COALESCE(c.lastName,'')) AS customer_name
FROM loan_customer lc
LEFT JOIN customers c ON c.customer_id = lc.customer_id
WHERE lc.status_approved = 'ACTIVE'
  AND lc.next_payment_due < CURDATE()
ORDER BY days_overdue DESC
LIMIT 5
```

**Returns:** 5 worst overdue loans

---

### 33. Loan Status Breakdown
**Type:** SELECT | **Operation:** READ  
**File:** `server/controllers/dashboardController.js`  
**Purpose:** Show distribution of loan statuses

```sql
SELECT status_approved AS status, COUNT(*) AS count
FROM loan_customer
GROUP BY status_approved
```

**Returns:** Count grouped by status

---

### 34. Monthly Collection Trend (Last 6 Months)
**Type:** SELECT | **Operation:** READ  
**File:** `server/controllers/dashboardController.js`  
**Purpose:** Show payment trend over time

```sql
SELECT
  DATE_FORMAT(payment_date, '%b')        AS month,
  COALESCE(SUM(amount_paid), 0)          AS collected
FROM loan_payments
WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(payment_date, '%Y-%m'), DATE_FORMAT(payment_date, '%b')
ORDER BY MIN(payment_date)
```

**Returns:** Monthly collection amounts

---

---

## 📌 QUERY SUMMARY STATISTICS

| Category | Total Queries | SELECT | INSERT | UPDATE | DELETE | COUNT |
|----------|---------------|--------|--------|--------|--------|-------|
| Auth | 2 | 1 | 1 | 0 | 0 | 2 |
| Customers | 5 | 3 | 1 | 1 | 1 | 5 |
| Loans | 8 | 4 | 1 | 2 | 1 | 8 |
| Payments | 3 | 1 | 1 | 0 | 1 | 3 |
| Reports | 10 | 10 | 0 | 0 | 0 | 10 |
| Dashboard | 5 | 5 | 0 | 0 | 0 | 5 |
| **TOTAL** | **33** | **24** | **4** | **3** | **3** | **34** |

---

## 🔄 Query Flow Chart: User Journey

```
LOGIN
  ↓
[Query 1: Find User by Email]
  ↓
[Query 2: Create User (if new)]
  ↓
HOME/DASHBOARD
  ↓
[Queries 30-34: Dashboard Data]
  ↓
CUSTOMERS
  ├─ [Query 3: Create Customer]
  ├─ [Query 4: Get All Customers]
  ├─ [Query 5: Get Customer by ID]
  ├─ [Query 6: Get Customers with Loan Count]
  ├─ [Query 7: Update Customer]
  └─ [Query 8: Delete Customer]
  ↓
LOANS
  ├─ [Query 9: Create Loan]
  ├─ [Query 10: Get All Loans]
  ├─ [Query 11: Get Loan by ID]
  ├─ [Query 12: Get Loans by Customer]
  ├─ [Query 13: Update Loan]
  ├─ [Query 14: Update Loan Status]
  ├─ [Query 15: Activate Loan]
  └─ [Query 16: Delete Loan]
  ↓
PAYMENTS
  ├─ [Query 17: Make Payment (Transaction)]
  ├─ [Query 18: Get All Payments]
  └─ [Query 19: Delete Payment]
  ↓
REPORTS
  ├─ Loan Summary
  │  ├─ [Query 20: Loan KPIs]
  │  ├─ [Query 21: All Loans]
  │  ├─ [Query 22: Status Breakdown]
  │  └─ [Query 23: Monthly Disbursement]
  │
  ├─ Payments Report
  │  ├─ [Query 24: Payment KPIs]
  │  └─ [Query 25: All Payments]
  │
  ├─ Overdue Report
  │  ├─ [Query 26: Overdue KPIs]
  │  └─ [Query 27: Overdue Loans]
  │
  └─ Customer Report
     ├─ [Query 28: Customer KPIs]
     └─ [Query 29: Customer Details]
```

---

## 📱 API Endpoints to Query Mapping

| HTTP Method | Endpoint | Query(ies) Used |
|-------------|----------|-----------------|
| POST | `/auth/register` | Query 2 |
| POST | `/auth/login` | Query 1 |
| GET | `/dashboard` | Queries 30-34 |
| POST | `/customers` | Query 3 |
| GET | `/customers` | Query 4 |
| GET | `/customers/:id` | Query 5 |
| GET | `/customers/with-loans` | Query 6 |
| PUT | `/customers/:id` | Query 7 |
| DELETE | `/customers/:id` | Query 8 |
| POST | `/loan_customers` | Query 9 |
| GET | `/loan_customers` | Query 10 |
| GET | `/loan_customers/:id` | Query 11 |
| GET | `/loan_customers/customer/:customer_id` | Query 12 |
| PUT | `/loan_customers/:id` | Query 13 |
| PATCH | `/loan_customers/:id/status` | Query 14 |
| PATCH | `/loan_customers/:id/activate` | Query 15 |
| DELETE | `/loan_customers/:id` | Query 16 |
| POST | `/payments/make` | Query 17 |
| GET | `/payments` | Query 18 |
| DELETE | `/payments/:id` | Query 19 |
| GET | `/reports/summary` | Queries 20-23 |
| GET | `/reports/payments` | Queries 24-25 |
| GET | `/reports/overdue` | Queries 26-27 |
| GET | `/reports/customers` | Queries 28-29 |

---

## 🔐 Transaction Safety

**Transactions Used:**
- **Query 17 (Make Payment)**: Uses `START TRANSACTION`, `COMMIT`, `ROLLBACK`
  - Ensures if INSERT succeeds but UPDATE fails, entire operation rolls back
  - Prevents data inconsistency

---

## ⚡ Performance Notes

- **Pagination**: Queries 21, 25, 27, 29 use `LIMIT 100`
- **Indexes Recommended**: 
  - `customers(customer_id)`
  - `loan_customer(customer_id, status_approved, next_payment_due)`
  - `loan_payments(loan_id, payment_date)`
- **Date Formatting**: All dates formatted to '%d %b %Y' for reports (e.g., "15 Jan 2024")

---

**End of MySQL Query Documentation**  
*Last Updated: April 8, 2026*

