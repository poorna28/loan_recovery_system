# 📊 LOAN RECOVERY SYSTEM - END-TO-END WORKFLOW GUIDE

**Application Version:** Development  
**Last Updated:** April 23, 2026  
**Document Type:** Complete Workflow Guide

---

## 🎯 APPLICATION PURPOSE

The **Loan Recovery System** is a comprehensive financial management platform designed to:

✅ **Manage Customer Relationships** - Profile management, KYC verification, credit scoring  
✅ **Loan Administration** - Application, approval, disbursement, tracking  
✅ **Payment Processing** - Record, track, and verify loan repayments  
✅ **Collections & Recovery** - Monitor overdue payments, track recovery efforts  
✅ **Reporting & Analytics** - Generate business intelligence and compliance reports  
✅ **System Configuration** - Manage company settings, interest rates, payment methods  

**Target Users:**
- Loan Officers / Managers - Handle applications & approvals
- Collections Team - Track payments & recovery
- Finance Team - Process payments & reconciliation
- System Administrators - Manage settings & users

---

## 🔐 AUTHENTICATION & LOGIN FLOW

### Step 1: Access Application
```
User opens application
         ↓
Browser navigates to http://localhost:3000
         ↓
React app loads
         ↓
Routes component checks if token exists
         ↓
NO TOKEN → Redirect to LOGIN page ✅
EXISTING TOKEN → Redirect to DASHBOARD
```

### Step 2: Login Page (`/`)

**Components:**
- Email input field
- Password input field
- Login button
- "Don't have account?" → Signup link

**What Happens:**
```
User enters credentials
         ↓
Frontend validation (email format, password not empty)
         ↓
VALID → Send POST /api/auth/login with email & password
         ↓
Backend authenticates:
  1. Find user by email in database
  2. Compare password with stored hash (bcryptjs)
  3. Generate JWT token if match
         ↓
SUCCESS → Return JWT token
         ↓
Frontend stores token in localStorage
         ↓
Redirect to /dashboard
         ↓
PrivateRoute component validates token
         ↓
Token valid → Load Dashboard
Token invalid/expired → Redirect to login
```

**API Endpoint:**
```
POST /api/auth/login
Request: { email: "user@example.com", password: "pass123" }
Response: { 
  success: true, 
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 3: Signup / Registration (`/signup`)

**Components:**
- Name input
- Email input
- Password input
- Confirm password field
- Signup button
- "Already have account?" → Login link

**What Happens:**
```
User enters registration details
         ↓
Frontend validation:
  - Email format valid
  - Password match
  - All fields filled
         ↓
VALID → Send POST /api/auth/signup
         ↓
Backend processes:
  1. Check if email already exists
  2. Hash password using bcryptjs
  3. Create user record in database
  4. Generate JWT token
         ↓
SUCCESS → User account created
         ↓
Return JWT token
         ↓
Frontend stores token
         ↓
Redirect to dashboard
```

**API Endpoint:**
```
POST /api/auth/signup
Request: { 
  name: "John Manager",
  email: "john@company.com", 
  password: "SecurePass123"
}
Response: { 
  success: true, 
  message: "Account created",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 4: Dashboard Access (`/dashboard`)

After login, user lands on **Protected Dashboard**

```
Token received from API
         ↓
Token stored in localStorage
         ↓
All subsequent API calls automatically include token:
Authorization: Bearer {token}
         ↓
Backend authMiddleware validates token on every request
         ↓
Token valid → Process request ✅
Token invalid/expired → Return 401 Unauthorized
         ↓
Frontend handles 401 → Redirect to login
```

---

## 📊 DASHBOARD WORKFLOW (After Login)

### Dashboard Page (`/dashboard`) - Home Base

**Purpose:** Central hub showing all business metrics

**What You See:**
1. **KPI Cards** - At the top
   - Total Customers
   - Total Loans
   - Total Collected (amount)
   - Total Pending (amount)
   - Active Loans count
   - Overdue count

2. **Recent Payments** - Last 5 payments
   - Payment ID
   - Loan ID
   - Amount
   - Payment Method
   - Date
   - Customer Name

3. **Overdue Alerts** - Top 5 overdue loans
   - Loan ID
   - Customer Name
   - Days Overdue
   - Due Date
   - Remaining Balance

4. **Loan Status Breakdown** - Pie chart
   - PENDING
   - APPROVED
   - ACTIVE
   - CLOSED
   - DEFAULTED

5. **Monthly Collection Trend** - Line chart
   - Last 6 months collections
   - Total collected each month

**Data Flow:**
```
User loads dashboard
         ↓
Frontend calls getDashboard API
         ↓
Backend runs 5 queries in parallel:
  1. SELECT COUNT(*) for all KPIs
  2. Get recent 5 payments
  3. Get top 5 overdue loans
  4. Group loans by status
  5. Monthly collection totals
         ↓
All data sent to frontend
         ↓
Frontend renders:
  - Number cards with KPIs
  - Payment table
  - Alert table
  - Charts/graphs
         ↓
User sees real-time dashboard
```

**API Endpoint:**
```
GET /api/dashboard
Response:
{
  kpis: {
    total_customers: 156,
    total_loans: 342,
    total_collected: 2500000,
    total_pending: 5600000,
    active_loans: 89,
    overdue_count: 12
  },
  recentPayments: [...],
  overdueLoans: [...],
  loanStatusBreakdown: [...],
  monthlyTrend: [...]
}
```

---

## 👥 CUSTOMER MANAGEMENT WORKFLOW

### 1️⃣ View All Customers (`/customers`)

**Purpose:** See all registered customers

**What You See:**
- Customer list table
- Search bar (search by name, email, phone)
- Filter options:
  - Profile Status (Active, Inactive, Suspended)
  - Employment Status (Employed, Self-employed, Unemployed)
  - Sort options (Name, Email, Credit Score, etc.)
- View, Edit, Delete buttons for each customer
- KPI summary at top:
  - Total customers
  - Active customers
  - Employed count
  - Average credit score

**Data Flow:**
```
User clicks "Customers" in sidebar
         ↓
Page loads
         ↓
Frontend calls GET /api/customers
         ↓
Backend fetches all customers from database
         ↓
Return list with pagination
         ↓
Frontend displays in table format
         ↓
User can search/filter (client-side or with API params)
```

**API Endpoint:**
```
GET /api/customers?search=john&sortBy=firstName&page=1&limit=50
Response:
{
  customers: [
    {
      id: 1,
      customer_id: "CUST001",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "9876543210",
      profileStatus: "Active",
      employmentStatus: "Employed",
      monthlyIncome: 50000,
      creditScore: 750,
      created_at: "2024-01-15"
    },
    ...
  ],
  pagination: { page: 1, limit: 50, total: 156 }
}
```

### 2️⃣ Add New Customer

**Who Can Do This:** Loan Officer / Manager

**Page:** Click "Add Customer" button → Modal/Form opens

**Form Fields to Fill:**

**Personal Information:**
- First Name *
- Last Name
- Email *
- Phone Number (Primary) *
- Secondary Phone Number
- Date of Birth
- Gender
- Nationality
- Title (Mr., Mrs., Ms., etc.)

**Address Information:**
- Address *
- City *
- State *
- Postal Code
- Address Proof (Upload file)

**Employment Information:**
- Employment Status * (Employed, Self-employed, Unemployed)
- Company Name (if employed)
- Job Title
- Monthly Income
- Annual Income
- Income Proof Document (Upload)

**Financial Information:**
- Credit Score
- Credit Score Band

**Government ID:**
- ID Type * (Aadhar, PAN, Passport, DL)
- ID Number *
- ID Issue Date
- ID Expiry Date
- ID Document (Upload)

**Profile Photo:**
- Photo upload

**Step-by-Step Process:**

```
Click "Add Customer" button
         ↓
Modal/Form opens with all fields
         ↓
User fills all required fields (marked with *)
         ↓
User uploads documents:
  - Address Proof
  - Income Proof
  - ID Document
  - Profile Photo
         ↓
User clicks "Save"
         ↓
Frontend validation:
  - All required fields filled
  - Email format valid
  - Phone format valid
  - At least one file uploaded
         ↓
VALID → Send POST /api/customers with form data + files
         ↓
Backend processes:
  1. Validate all fields
  2. Save document files to /uploads
  3. Store file paths in database
  4. Create customer record
  5. Auto-generate customer_id (CUST001, CUST002, etc.)
         ↓
SUCCESS → Show toast "Customer created successfully"
         ↓
Refresh customer list
         ↓
New customer appears in list
```

**API Endpoint:**
```
POST /api/customers
Request (multipart/form-data):
{
  firstName: "Rajesh",
  lastName: "Kumar",
  email: "rajesh@example.com",
  phoneNumber: "9876543210",
  address: "123 Main St",
  city: "Mumbai",
  state: "Maharashtra",
  postalCode: "400001",
  employmentStatus: "Employed",
  companyName: "Tech Corp",
  monthlyIncome: 75000,
  annualIncome: 900000,
  creditScore: 720,
  govtIdType: "Aadhar",
  govtIdNumber: "123456789012",
  addressProof: <file>,
  idDocumentUpload: <file>,
  customerPhoto: <file>
}

Response:
{
  message: "Customer created",
  customerId: "CUST156"
}
```

### 3️⃣ View Customer Details

**Purpose:** See complete customer information

**Action:** Click customer name in list → Details modal opens

**What You See:**
- All personal information
- Document uploads/links
- Linked loans (list of loans this customer has)
- Payment history
- Edit and Delete buttons

**Data Flow:**
```
User clicks on customer row
         ↓
Frontend calls GET /api/customers/{customer_id}
         ↓
Backend fetches customer details from database
         ↓
Returns all fields including documents
         ↓
Modal opens and displays all information
         ↓
Documents shown as downloadable links
         ↓
Linked loans displayed in section below
```

### 4️⃣ Edit Customer Information

**Action:** Click "Edit" button on customer row

**What Happens:**
```
Click "Edit" → Form pre-fills with current data
         ↓
User modifies fields (can change any information)
         ↓
Can upload new documents (replaces old ones)
         ↓
Click "Update" button
         ↓
Frontend validation
         ↓
VALID → Send PUT /api/customers/{customer_id}
         ↓
Backend updates all fields in database
         ↓
SUCCESS → Show "Customer updated successfully"
         ↓
Refresh customer list
```

### 5️⃣ Delete Customer

**Action:** Click "Delete" button

**Important:** 
- ❌ **Cannot delete if customer has ACTIVE or APPROVED loans**
- ✅ Can delete if no loans or only CLOSED loans

**Process:**
```
Click "Delete" → Confirmation dialog appears
         ↓
"Are you sure you want to delete this customer?"
         ↓
User confirms
         ↓
Frontend calls DELETE /api/customers/{customer_id}
         ↓
Backend checks:
  1. Does customer have ACTIVE loans?
  2. Does customer have APPROVED loans?
         ↓
YES → Return error: "Cannot delete customer with active loans"
NO → Proceed with deletion
         ↓
Delete all customer records
         ↓
Remove from database
         ↓
SUCCESS → Show "Customer deleted"
         ↓
Customer disappears from list
```

---

## 💰 LOAN MANAGEMENT WORKFLOW

### 1️⃣ View All Loans (`/loan_details`)

**Purpose:** See all loan applications and active loans

**What You See:**
- Loan list table with columns:
  - Loan ID
  - Customer Name
  - Loan Amount
  - Status (PENDING, APPROVED, ACTIVE, CLOSED, DEFAULTED)
  - Application Date
  - Interest Rate
  - Tenure
  - Remaining Balance
  - Next Due Date
- Search and filter options
- View, Edit, Delete buttons

**Data Flow:**
```
User navigates to "Loans"
         ↓
Frontend calls GET /api/loan_customers
         ↓
Backend fetches all loans
         ↓
Each loan includes linked customer info
         ↓
Return data to frontend
         ↓
Frontend renders table
         ↓
User can search/filter by status, customer, amount, etc.
```

### 2️⃣ Create New Loan Application

**Who Can Do This:** Loan Officer / Manager

**Prerequisites:** Customer must already be registered

**Page:** Click "New Loan" button → Form opens

**Form Fields:**

**Loan Details:**
- Customer ID/Name * (dropdown to select existing customer)
- Loan Amount * (₹)
- Loan Purpose * (Home, Auto, Personal, Business, Education, etc.)
- Tenure * (months)
- Annual Interest Rate * (%)

**Dates:**
- Application Date (auto-filled with today)
- Expected Disbursement Date

**Calculated Fields (Auto-filled):**
- Monthly EMI (auto-calculated from amount, rate, tenure)
- Total Interest Amount
- Total Repayment Amount

**Status:**
- Initial Status (defaults to PENDING)

**Step-by-Step Process:**

```
Click "New Loan" → Form opens
         ↓
Select customer from dropdown
         ↓
Customer's information auto-loads:
  - Name
  - Current status
  - Credit score
  - Employment info
         ↓
Enter loan details:
  - Loan amount
  - Purpose
  - Tenure
  - Interest rate
         ↓
System auto-calculates:
  EMI = (Principal × Rate × (1+Rate)^Months) / ((1+Rate)^Months - 1)
         ↓
Review calculated amounts:
  - Monthly EMI
  - Total interest
  - Total payable
         ↓
Click "Create Loan"
         ↓
Frontend validation:
  - Customer selected
  - All required fields filled
  - Amount > 0
  - Tenure > 0
  - Interest rate valid
         ↓
VALID → Send POST /api/loan_customers
         ↓
Backend creates:
  1. Loan record in database
  2. Auto-generates loan_id (USR1001, USR1002, etc.)
  3. Sets status to PENDING
  4. Records application date
  5. Sets next payment due date
         ↓
SUCCESS → Show confirmation
         ↓
Loan appears in list with PENDING status
         ↓
Next step: Manager needs to APPROVE or REJECT
```

**API Endpoint:**
```
POST /api/loan_customers
Request:
{
  customer_id: "CUST156",
  loan_amount: 500000,
  loan_purpose: "Home Loan",
  interest_rate: 8.5,
  loan_term: 180,
  application_date: "2024-04-23",
  monthly_payment: 3456.78,
  next_payment_due: "2024-05-23"
}

Response:
{
  message: "Loan Customer created",
  loan_id: "USR1234",
  id: 15
}
```

### 3️⃣ View Loan Details

**Action:** Click on loan in list → Details modal opens

**What You See:**
- Customer information
- Loan details:
  - Loan ID
  - Amount
  - Purpose
  - Status
  - Interest rate
  - Tenure
  - Monthly EMI
- Dates:
  - Application date
  - Approval date
  - Expected disbursement
  - Next payment due
- Balances:
  - Original amount
  - Total paid so far
  - Remaining balance
- Payment history (all payments made)
- Next due payment information

### 4️⃣ Approve Loan

**Who Can Do This:** Manager / Approver only

**Current Status:** PENDING

**Action:** Click "Approve" button in loan details

**Process:**
```
Manager reviews loan details
         ↓
Manager verifies:
  - Customer creditworthiness
  - Income verification
  - Document completeness
  - Risk assessment
         ↓
Click "Approve Loan" button
         ↓
Approval confirmation dialog:
  "Approve loan of ₹500,000 to John Doe?"
         ↓
Manager confirms
         ↓
Frontend sends PUT /api/loan_customers/{id}/approve
         ↓
Backend updates:
  1. Sets status to APPROVED
  2. Records approval date
  3. Calculates disbursement date
  4. Updates next payment due date
         ↓
SUCCESS → Loan status changes to APPROVED
         ↓
Loan waiting for DISBURSEMENT
         ↓
Finance team can now process disbursement
```

### 5️⃣ Disburse Loan (Activate)

**Who Can Do This:** Finance team / Manager

**Current Status:** APPROVED

**What Happens:**
```
Manager clicks "Disburse" or "Activate Loan"
         ↓
System updates:
  1. Status changes to ACTIVE
  2. Disbursement date recorded
  3. Loan becomes live
  4. Payment collection starts
         ↓
Customer can now:
  - Make payments
  - Check balance
  - View payment schedule
         ↓
System starts tracking:
  - Due dates
  - Overdue amounts
  - Payment progress
```

### 6️⃣ Reject Loan

**Who Can Do This:** Manager / Approver

**Current Status:** PENDING

**Action:** Click "Reject" button

**Process:**
```
Manager reviews loan
         ↓
Decides to reject due to:
  - Insufficient income
  - Poor credit score
  - Incomplete documents
  - High risk
         ↓
Click "Reject Loan"
         ↓
Dialog asks for rejection reason (optional)
         ↓
Manager provides reason: "Credit score too low"
         ↓
Click "Confirm Rejection"
         ↓
Backend updates:
  1. Status changes to REJECTED
  2. Stores rejection reason
  3. Records rejection date
         ↓
Loan marked as rejected
         ↓
Customer cannot make payments on this loan
```

---

## 💳 PAYMENT PROCESSING WORKFLOW

### 1️⃣ View All Payments (`/payments`)

**Purpose:** See all payment records and history

**What You See:**
- Payments table with columns:
  - Payment ID
  - Loan ID
  - Customer Name
  - Amount Paid
  - Payment Method
  - Payment Date
  - Status (Successful, Pending, Failed)
- Filter by payment method
- Filter by date range
- View payment details button

**Data Flow:**
```
User navigates to "Payments"
         ↓
Frontend calls GET /api/payments
         ↓
Backend fetches all payment records
         ↓
Joins with loan and customer data
         ↓
Return formatted payment list
         ↓
Frontend displays with formatting:
  - Amounts shown in ₹ format
  - Dates formatted (DD MMM YYYY)
  - Status colored (Green = Success, Red = Failed)
```

### 2️⃣ Record New Payment

**Who Can Do This:** Finance team / Collections team

**Page:** Click "Record Payment" button → Payment form opens

**Form Fields:**

**Loan Selection:**
- Loan ID / Customer Name * (dropdown)

**Payment Details:**
- Amount Paid * (₹)
- Payment Date * (date picker)
- Payment Method * (Cash, Check, Transfer, Card, Online)

**Optional:**
- Reference/Check Number (for checks/transfers)
- Notes

**Step-by-Step Process:**

```
Click "Record Payment" → Form opens
         ↓
Select loan from dropdown
         ↓
Loan info auto-loads:
  - Customer name
  - Current balance
  - Amount due
  - Last payment date
         ↓
Enter payment amount
         ↓
Select payment method
         ↓
Pick payment date
         ↓
Click "Submit Payment"
         ↓
Frontend validation:
  - Loan selected
  - Amount > 0
  - Amount ≤ remaining balance
  - Payment date valid
  - All required fields filled
         ↓
VALID → Send POST /api/payments
         ↓
Backend processes:
  1. Validate loan exists and is ACTIVE
  2. Validate amount doesn't exceed balance
  3. Check for overpayment
  4. Create payment record
  5. Auto-calculate next due date:
     - If full payment: Mark loan as CLOSED
     - If partial: Calculate next due date
  6. Update loan remaining balance
  7. Update last payment date
         ↓
PAYMENT SUCCESSFUL ✅
         ↓
Response returns:
  - Payment ID
  - New remaining balance
  - Next due date
  - Loan status (if changed)
         ↓
Frontend shows success message:
  "Payment of ₹50,000 recorded successfully"
  "Remaining balance: ₹450,000"
  "Next payment due: 23-May-2024"
         ↓
Payment appears in list
         ↓
Dashboard KPIs update:
  - Total collected increases
  - Total pending decreases
```

**API Endpoint:**
```
POST /api/payments
Request:
{
  loanId: 15,
  amount: 50000,
  method: "TRANSFER",
  paymentDate: "2024-04-23"
}

Response:
{
  success: true,
  message: "Payment successful",
  payment: {
    id: 127,
    loan_id: 15,
    amount_paid: 50000,
    remaining_balance: 450000,
    next_due_date: "2024-05-23",
    payment_date: "2024-04-23"
  }
}
```

### 3️⃣ View Payment Details

**Action:** Click on payment in list → Details modal

**What You See:**
- Payment ID
- Loan ID & Customer
- Amount paid
- Payment method
- Date
- Reference number (if applicable)
- Updated balance
- Next due date

### 4️⃣ Overdue Payment Tracking

**Automatic Process:**

```
Every time dashboard loads:
         ↓
Backend checks:
  FOR EACH active loan:
    IF next_payment_due < TODAY:
      Mark as OVERDUE
      Calculate days_overdue
      Display in overdue alerts
         ↓
Dashboard shows:
  - Overdue count (top KPI)
  - Overdue loans table:
    * Loan ID
    * Customer name
    * Days overdue
    * Due date
    * Remaining balance
    * Last payment date
         ↓
Collections team sees:
  - Which loans need follow-up
  - How many days overdue
  - Amount at risk
         ↓
Can take action:
  - Send reminder
  - Make phone call
  - Process late payment
  - Escalate to recovery
```

---

## 📈 REPORTING & ANALYTICS WORKFLOW

### 1️⃣ View Reports (`/reports`)

**Purpose:** Generate business intelligence and compliance reports

**Report Types Available:**

**Report 1: Summary Report**
- Total customers
- Total loans
- Total collection
- Total pending
- Status breakdown (PENDING, APPROVED, ACTIVE, CLOSED, DEFAULTED)
- Monthly disbursement trend
- Loan list with all details

**Report 2: Payments Report**
- Total amount collected
- Number of payments
- Payment methods breakdown
- Average payment amount
- Payment trends
- All payment records

**Report 3: Overdue Report**
- Total overdue amount
- Number of overdue loans
- Days overdue distribution
- Overdue loans list with details
- Recovery rate
- Risk assessment

**Report 4: Customer Report**
- Total customers by status
- Customers by employment type
- Credit score distribution
- New customers (this month)
- Customer list with details

**Data Flow:**
```
User navigates to Reports
         ↓
Selects report type
         ↓
Frontend calls GET /api/reports/{report_type}
         ↓
Backend runs complex queries:
  - Multiple JOINs across tables
  - Date filtering
  - Aggregations (SUM, COUNT, AVG)
  - Grouping by status/date
         ↓
Backend returns:
  - KPIs
  - Detailed records
  - Trends
         ↓
Frontend renders:
  - Summary metrics
  - Data tables
  - Charts/graphs
         ↓
User sees complete report
         ↓
Can export or print
```

**Example - Summary Report:**
```
GET /api/reports/summary
Response:
{
  kpis: {
    total_customers: 156,
    total_loans: 342,
    total_collection: 2500000,
    total_pending: 5600000,
    average_loan: 145000
  },
  loans: [
    {
      loan_id: "USR1001",
      customer_name: "John Doe",
      amount: 500000,
      status: "ACTIVE",
      application_date: "2024-01-15",
      ...
    },
    ...
  ],
  statusBreakdown: [
    { status: "ACTIVE", count: 89 },
    { status: "PENDING", count: 23 },
    { status: "APPROVED", count: 15 },
    { status: "CLOSED", count: 200 },
    { status: "DEFAULTED", count: 15 }
  ],
  monthlyDisbursement: [
    { month: "Jan", amount: 5000000 },
    { month: "Feb", amount: 4500000 },
    ...
  ]
}
```

---

## ⚙️ SETTINGS & CONFIGURATION WORKFLOW

### 1️⃣ Company Profile Settings (`/company_profile`)

**Purpose:** Manage company information

**Fields:**
- Company Name
- Company Address
- Contact Email
- Contact Phone
- Company Registration Number
- Tax ID
- Logo/Branding

**Process:**
```
Manager clicks "Settings" → "Company Profile"
         ↓
Form pre-fills with current company details
         ↓
Manager can edit any field
         ↓
Click "Save Changes"
         ↓
Frontend sends PUT /api/settings/company-profile
         ↓
Backend updates database
         ↓
Changes reflected application-wide
```

### 2️⃣ Interest Rates Configuration (`/interest_rate`)

**Purpose:** Define interest rates for different loan types

**Loan Types:**
- Home Loans
- Auto Loans
- Personal Loans
- Business Loans

**Configuration:**
```
For each loan type:
  - Annual Interest Rate (%)
  - System auto-calculates:
    * Monthly rate
    * Daily rate

Example:
  Annual: 8.5% → Monthly: 0.708% → Daily: 0.0233%
```

**Process:**
```
Manager navigates to Interest Rates
         ↓
Sees sliders for each loan type
         ↓
Adjusts rates as needed
         ↓
Real-time calculations shown:
  - Monthly rate
  - Daily rate
  - Example EMI for ₹1,000,000 loan
         ↓
Click "Update Rates"
         ↓
Backend updates settings
         ↓
Message: "Rates updated successfully"
         ↓
Note: Only affects NEW loans
         ↓
Existing loans keep original rates
```

### 3️⃣ Loan Configuration (`/loan_config`)

**Purpose:** Define loan parameters

**Configuration Options:**

**Tenure Settings:**
- Minimum tenure (months)
- Maximum tenure (months)
- Default tenure (months)

**Loan Amount:**
- Minimum loan amount (₹)
- Maximum loan amount (₹)

**Payment Rules:**
- EMI Calculation Method (reducing balance or flat)
- Payment frequency (monthly, quarterly, etc.)
- Grace period (days)
- Penalty for late payment
- Maximum penalty amount

**Example:**
```
Tenure: Min 6, Max 360, Default 60 months
Amount: Min 50,000, Max 10,000,000
EMI Method: Reducing balance
Grace Period: 5 days
Late Penalty: 2% per month
Max Penalty: 5% of loan amount
```

### 4️⃣ Payment Methods Configuration (`/payment_methods`)

**Purpose:** Define accepted payment methods

**Available Methods:**
- Cash
- Check
- Bank Transfer
- Credit/Debit Card
- Online Payment

**Configuration:**
```
Each method can be:
  - ENABLED (accepting payments)
  - DISABLED (not accepting)

Additional settings:
  - Processing fee %
  - Settlement time
  - Max amount per transaction
```

**Example:**
```
✅ Cash - Enabled, 0% fee, instant
✅ Transfer - Enabled, 0.5% fee, 1 day
✅ Card - Enabled, 1.5% fee, 1 day
❌ Check - Disabled
✅ Online - Enabled, 0.25% fee, instant
```

### 5️⃣ Notifications Settings (`/notifications`)

**Purpose:** Configure SMS/Email notifications

**Notification Types:**
- Payment Due Reminder
- Payment Confirmation
- Loan Approval
- Overdue Alert
- Loan Closing

**Configuration:**
```
For each notification:
  - Enable/Disable
  - SMS: Yes/No
  - Email: Yes/No
  - Template text
  - Send time (auto/manual)

Example:
  Payment Due Reminder:
    ✅ SMS: "Your loan payment of ₹3,456 is due on 23-May. Reply YES to confirm"
    ✅ Email: "Payment reminder..."
    Auto send: 2 days before due date
```

### 6️⃣ Users & Roles Management (`/users_roles`)

**Purpose:** Manage system users and permissions

**User Management:**
- Create user
- View all users
- Edit user details
- Assign roles
- Deactivate user
- Delete user

**Roles:**
- Admin (full access)
- Manager (loan approval, payment recording)
- Officer (customer registration, loan application)
- Collections (payment tracking, overdue management)
- Finance (disbursement, reporting)

**Permissions:** (40+ system permissions)
- Can view customers
- Can create customers
- Can edit customers
- Can delete customers
- Can create loans
- Can approve loans
- Can record payments
- Can view reports
- Can manage settings
- etc.

**Example Workflow:**
```
Admin goes to Users & Roles
         ↓
Sees list of all users
         ↓
Clicks "Add User"
         ↓
Fills form:
  - Name: Rajesh Kumar
  - Email: rajesh@company.com
  - Password: (auto-generated)
  - Role: Loan Officer
         ↓
Assigns permissions:
  ✅ Can view customers
  ✅ Can create customers
  ✅ Can create loans
  ✅ Can view payments
  ❌ Can approve loans
  ❌ Can manage settings
         ↓
Click "Create User"
         ↓
Backend creates account
         ↓
Sends welcome email with temporary password
         ↓
User logs in and changes password
         ↓
User can now perform assigned tasks
```

### 7️⃣ Danger Zone (System Operations) (`/danger_zone`)

**Purpose:** Critical system operations

**Options:**
- Reset System (delete all data)
- Backup System (download database backup)
- View Audit Log (all changes made)
- Database Cleanup

**Warning:** Requires admin approval and password confirmation

---

## 🔄 COMPLETE END-TO-END SCENARIO

### Real-World Example: New Customer Gets a Loan

**Day 1: Customer Registration**

```
Morning:
  Loan Officer: "Hi, I want to register a new customer"
  
Step 1: Login
  - Go to http://localhost:3000
  - Enter email & password
  - Click Login → Dashboard loads
  
Step 2: Register Customer
  - Click "Customers" in sidebar
  - Click "Add Customer" button
  - Fill form:
    * Name: Rajesh Kumar
    * Email: rajesh@example.com
    * Phone: 9876543210
    * Address: Mumbai
    * Employment: Employed at TechCorp
    * Monthly Income: ₹75,000
    * Credit Score: 720
  - Upload documents:
    * Address proof (PDF)
    * Income proof (Bank statement)
    * Govt ID (Aadhar)
    * Photo
  - Click "Save"
  - System generates: CUST156
  - Toast: "Customer registered successfully"
  - Rajesh appears in customer list
```

**Day 2: Loan Application**

```
Morning:
  Loan Officer: "Rajesh Kumar wants a home loan"
  
Step 3: Create Loan
  - Navigate to "Loans"
  - Click "New Loan"
  - Fill form:
    * Select Customer: Rajesh Kumar (CUST156)
    * Loan Amount: ₹500,000
    * Purpose: Home Loan
    * Tenure: 60 months (5 years)
    * Interest Rate: 8.5% (from settings)
  - System calculates:
    * Monthly EMI: ₹10,088.50
    * Total Interest: ₹105,310
    * Total Repayment: ₹605,310
  - Click "Create Loan"
  - System generates: USR1001
  - Status: PENDING
  - Toast: "Loan application submitted"
```

**Day 3: Loan Approval**

```
Afternoon:
  Loan Manager: Reviews all pending loans
  
Step 4: Approve Loan
  - Navigate to "Loans"
  - See USR1001 with PENDING status
  - Click loan → Details open
  - Review:
    * Customer creditworthiness ✅
    * Income verification ✅
    * Documents ✅
  - Click "Approve Loan"
  - Status changes: PENDING → APPROVED
  - Toast: "Loan approved successfully"
  - Rajesh can now make payments
```

**Day 4: Loan Disbursement**

```
Morning:
  Finance Team: Process approved loans
  
Step 5: Activate/Disburse Loan
  - Navigate to "Loans"
  - See USR1001 with APPROVED status
  - Click "Disburse" button
  - System transfers ₹500,000 to Rajesh's account
  - Status changes: APPROVED → ACTIVE
  - First payment due date set: 23-May-2024
  - Rajesh starts payment cycle
```

**Month 1: First Payment Due (May 23)**

```
2 days before (May 21):
  - System sends SMS: "Your payment of ₹10,089 is due on 23-May"
  - System sends Email: "Payment reminder..."
  
On Due Date (May 23):
  Rajesh: "I'm making my first payment"
  
Step 6: Record Payment
  - Collections team receives call
  - Navigate to "Payments"
  - Click "Record Payment"
  - Fill form:
    * Loan: USR1001 (Rajesh Kumar)
    * Amount: ₹10,089
    * Method: Bank Transfer
    * Date: 23-May-2024
  - Click "Submit"
  - System processes:
    * Payment recorded
    * Balance: 500,000 - 10,089 = ₹489,911
    * Next due date: 23-June-2024
    * Interest accrued updated
  - Toast: "Payment successful"
  - Payment appears in list
  - Dashboard KPIs update
```

**Months 2-60: Regular Payments**

```
Every month on 23rd:
  - Rajesh makes payment of ₹10,089
  - System records payment
  - Balance decreases
  - New next due date calculated
  - If overdue (no payment by 28th):
    * System flags as OVERDUE
    * Collections team sees in alerts
    * Can send reminder
    * Apply late payment penalty
```

**Month 60: Final Payment**

```
Year 5, Month 60 (April 23, 2029):
  Rajesh: "I'm making my final payment"
  
Collections team:
  - Last EMI: ₹10,089
  - Records final payment
  - System calculates:
    * Total paid: ₹605,340
    * Loan balance: ₹0
    * Status: CLOSED ✅
  
Confirmation email to Rajesh:
  "Your loan USR1001 has been successfully closed.
   Total amount paid: ₹605,340
   Thank you for choosing our services."
```

**Anytime: View Dashboard & Reports**

```
Manager wants to review business metrics:

Step 7: View Dashboard
  - Click "Dashboard"
  - See KPIs:
    * Total Customers: 156
    * Total Loans: 342
    * Total Collected: ₹2,500,000 (includes Rajesh's ₹605,340)
    * Total Pending: ₹5,600,000
    * Active Loans: 89
    * Overdue: 12
  - See Recent Payments:
    * Rajesh Kumar: ₹10,089 on 23-May-2024
    * ...
  - See Overdue Alerts:
    * Loan XYZ: 15 days overdue, ₹50,000
    * ...
  - See Charts:
    * Status breakdown pie chart
    * Monthly collection trend line chart

Step 8: Generate Reports
  - Navigate to "Reports"
  - Select "Summary Report"
  - System generates:
    * Total customers
    * Total loans
    * Collection vs pending comparison
    * Status breakdown
    * All loan details
  - View in browser or export as PDF
```

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION LAYER (Frontend)               │
│                         React.js Components                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Login → Dashboard → Customers → Loans → Payments → Reports → ⚙️    │
│                                                                      │
│  Each page fetches/sends data to API                               │
└─────────────────────────────────────────────────────────────────────┘
                               ↓↑
                         HTTP Requests
                     (with JWT Token)
┌─────────────────────────────────────────────────────────────────────┐
│              API LAYER (Backend - Node.js/Express)                   │
│                                                                      │
│  Routes ← Controllers ← Middleware (Validation, Auth, Logging)     │
│                                                                      │
│  /api/customers    → customerController → customerModel             │
│  /api/loans        → loanController → loanModel                     │
│  /api/payments     → paymentController → paymentModel               │
│  /api/reports      → reportController → reportModel                 │
│  /api/dashboard    → dashboardController → multiple models          │
│  /api/settings     → settingsController → settingsModel             │
│  /api/auth         → authController → userModel                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                               ↓↑
                         Database Queries
                          (parameterized)
┌─────────────────────────────────────────────────────────────────────┐
│                  DATA LAYER (MySQL Database)                         │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │ users    │  │customers │  │loan_customer│  │loan_payments │   │
│  └──────────┘  └──────────┘  └─────────────┘  └──────────────┘   │
│                                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │ reports  │  │   settings   │  │role/perms    │                │
│  └──────────┘  └──────────────┘  └──────────────┘                │
│                                                                      │
│  All data relationships maintained via Foreign Keys                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Workflow

**Every request follows this security path:**

```
1. User enters credentials → Frontend
2. Frontend sends request to /api/auth/login
3. Backend validates email & password
4. Returns JWT token (expires in 24h)
5. Frontend stores token in localStorage
6. All subsequent requests include token:
   Authorization: Bearer {token}
7. AuthMiddleware validates token on each request
8. If valid → Request processed
9. If invalid/expired → Return 401 Unauthorized
10. Frontend detects 401 → Redirect to login
11. User must re-authenticate
```

---

## ✅ COMPLETE WORKFLOW SUMMARY

| Step | Module | Action | Result |
|------|--------|--------|--------|
| 1 | Auth | Login/Signup | JWT token obtained |
| 2 | Dashboard | View KPIs | Business metrics displayed |
| 3 | Customers | Register new customer | Customer ID generated |
| 4 | Loans | Create loan application | Loan in PENDING status |
| 5 | Loans | Approve loan | Loan in APPROVED status |
| 6 | Loans | Disburse loan | Loan in ACTIVE status |
| 7 | Payments | Record payment | Balance updated, next due calculated |
| 8 | Payments | Track overdue | Overdue status flagged if past due |
| 9 | Reports | Generate report | Business intelligence displayed |
| 10 | Settings | Manage config | System parameters updated |

---

## 🎯 KEY FEATURES BY MODULE

### Module Overview

```
CUSTOMERS MODULE
├── Register new customers
├── View customer profiles
├── Edit customer information
├── Upload and manage documents
├── Delete customers (if no active loans)
└── Track customer credit scores

LOANS MODULE
├── Create loan applications
├── View all loans with status
├── Approve pending loans
├── Disburse approved loans
├── Track loan balance
├── Monitor next payment due
└── Close completed loans

PAYMENTS MODULE
├── Record new payments
├── Track payment history
├── Identify overdue payments
├── Manage payment methods
├── Calculate remaining balance
└── Generate payment receipts

DASHBOARD MODULE
├── View KPI cards (real-time)
├── See recent payments
├── Identify overdue alerts
├── Track collection trends
├── Monitor loan status
└── Quick access to metrics

REPORTS MODULE
├── Generate summary reports
├── Payment reports
├── Overdue reports
├── Customer reports
├── Export data (PDF/CSV)
└── Compliance documentation

SETTINGS MODULE
├── Company profile
├── Interest rates
├── Loan configuration
├── Payment methods
├── Notifications
├── Users & roles
└── System operations
```

---

**This completes the end-to-end workflow guide. Users can now understand exactly what the application does and how to use every feature from login to generating reports.**
