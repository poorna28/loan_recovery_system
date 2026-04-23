# 🎨 WORKFLOW VISUAL DIAGRAMS & FLOWCHARTS

**Document:** Complete Visual Representation of Application Workflows  
**Date:** April 23, 2026

---

## 1️⃣ AUTHENTICATION FLOW

### Diagram: User Login Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │  User Opens App │
    │ localhost:3000  │
    └────────┬────────┘
             │
             ↓
    ┌────────────────────┐
    │  Routes Component  │
    │ checks localStorage│
    │  for JWT token    │
    └────────┬───────────┘
             │
        ┌────┴────┐
        │          │
        ↓          ↓
   No Token    Token Exists
        │          │
        ↓          ↓
   ┌────────┐  ┌──────────┐
   │ LOGIN  │  │ DASHBOARD│
   │ PAGE   │  │  PAGE    │
   └────┬───┘  └──────────┘
        │
        ↓
   ┌──────────────────────────┐
   │  User enters:             │
   │  - Email                  │
   │  - Password               │
   └────────┬─────────────────┘
            │
            ↓
   ┌──────────────────────────┐
   │  Frontend Validation      │
   │  - Email format check ✓   │
   │  - Password not empty ✓   │
   └────────┬─────────────────┘
            │
        ┌───┴────┐
        │         │
        ↓         ↓
    INVALID   VALID
        │         │
        ↓         ↓
   ┌────────┐ ┌──────────────────────────┐
   │ Error  │ │ POST /api/auth/login     │
   │Message │ │ {email, password}        │
   └────────┘ └────────┬─────────────────┘
                       │
                       ↓
            ┌─────────────────────────┐
            │ Backend Processing      │
            │ 1. Find user by email   │
            │ 2. Compare password     │
            │    (bcryptjs)           │
            │ 3. Generate JWT token   │
            └────────┬────────────────┘
                     │
                 ┌───┴───┐
                 │       │
                 ↓       ↓
            SUCCESS  FAILED
                 │       │
                 ↓       ↓
            ┌─────────┐ ┌────────┐
            │ Token   │ │ Error  │
            │returned │ │Invalid │
            └────┬────┘ │Creds   │
                 │      └────────┘
                 ↓
       ┌──────────────────────────┐
       │ Store token in           │
       │ localStorage             │
       └────────┬─────────────────┘
                │
                ↓
       ┌──────────────────────────┐
       │ Set Authorization header │
       │ Bearer {token}           │
       └────────┬─────────────────┘
                │
                ↓
       ┌──────────────────────────┐
       │ Redirect to /dashboard   │
       │ Dashboard loads          │
       │ User is authenticated ✓  │
       └──────────────────────────┘

    ┌─────────────────────────────────────┐
    │   ALL SUBSEQUENT REQUESTS            │
    │   Include Token in Header:           │
    │   Authorization: Bearer {jwt_token}  │
    │                                      │
    │   Backend validates token on each    │
    │   request using authMiddleware       │
    └─────────────────────────────────────┘
```

---

## 2️⃣ CUSTOMER MANAGEMENT WORKFLOW

### Diagram: Complete Customer Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                  CUSTOMER MANAGEMENT WORKFLOW                        │
└──────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │ Click Customers  │
    │ in Sidebar       │
    └────────┬─────────┘
             │
             ↓
    ┌──────────────────────────────┐
    │ GET /api/customers           │
    │ Fetch all customer records   │
    └────────┬─────────────────────┘
             │
             ↓
    ┌──────────────────────────────┐
    │ Display Customer List Table  │
    │ - Customer ID                │
    │ - Name                       │
    │ - Email                      │
    │ - Phone                      │
    │ - Status                     │
    │ - Actions (View/Edit/Delete) │
    └────────┬─────────────────────┘
             │
        ┌────┼────┬────────────────┐
        │    │    │                │
        ↓    ↓    ↓                ↓
    ┌─────┐┌───┐┌────┐       ┌──────────┐
    │VIEW │ADD │EDIT │       │ SEARCH/  │
    └──┬──┘└─┬─┘└─┬──┘       │ FILTER   │
       │     │    │          └──────────┘
       │     │    │
   ┌───┴────┴────┴────┐
   │                  │
   ↓                  ↓
┌──────────────┐   ┌──────────────────────────┐
│ View Details │   │ Add New Customer         │
│ Modal opens  │   │ Form opens with fields:  │
│ Shows all    │   │ - First Name             │
│ customer info│   │ - Last Name              │
│ + documents  │   │ - Email                  │
│ + linked     │   │ - Phone                  │
│   loans      │   │ - Address                │
└──────────────┘   │ - Employment Status      │
                   │ - Monthly Income         │
                   │ - Credit Score           │
                   │ - Upload Documents       │
                   │   * Address Proof        │
                   │   * Income Proof         │
                   │   * ID Document          │
                   │   * Photo                │
                   └──────┬───────────────────┘
                          │
                          ↓
                   ┌──────────────────────────┐
                   │ User fills all fields    │
                   │ Uploads documents       │
                   │ Clicks "Save Customer"  │
                   └──────┬───────────────────┘
                          │
                          ↓
                   ┌──────────────────────────┐
                   │ Frontend Validation      │
                   │ - Required fields ✓      │
                   │ - Email format ✓         │
                   │ - Phone format ✓         │
                   │ - Files uploaded ✓       │
                   └──────┬───────────────────┘
                          │
                      ┌───┴───┐
                      │       │
                      ↓       ↓
                  INVALID  VALID
                      │       │
                      ↓       ↓
                  ERROR    ┌──────────────────────────┐
                  MESSAGE  │ POST /api/customers      │
                           │ with form data + files   │
                           └──────┬───────────────────┘
                                  │
                                  ↓
                           ┌──────────────────────────┐
                           │ Backend Processing       │
                           │ 1. Validate all fields   │
                           │ 2. Save files to        │
                           │    /uploads folder       │
                           │ 3. Generate customer_id  │
                           │ 4. Create record in DB   │
                           │ 5. Return success        │
                           └──────┬───────────────────┘
                                  │
                                  ↓
                           ┌──────────────────────────┐
                           │ Success Toast           │
                           │ "Customer created:       │
                           │  CUST156"               │
                           └──────┬───────────────────┘
                                  │
                                  ↓
                           ┌──────────────────────────┐
                           │ Refresh customer list   │
                           │ New customer appears    │
                           │ Can now apply for loan  │
                           └──────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    EDIT CUSTOMER FLOW                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Click "Edit" → Form pre-fills → Modify fields → Click "Update"   │
│  → Backend validates → Update database → Refresh list              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    DELETE CUSTOMER FLOW                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Click "Delete" → Confirmation dialog appears →                     │
│  Backend checks: Does customer have ACTIVE loans?                   │
│    ↓                                                                │
│  YES → Error: "Cannot delete customer with active loans"           │
│  NO → Delete customer → Remove from database → List refreshes      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ LOAN MANAGEMENT WORKFLOW

### Diagram: Complete Loan Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                    LOAN MANAGEMENT WORKFLOW                          │
└──────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐
    │ Click "Loans"    │
    │ in Sidebar       │
    └────────┬─────────┘
             │
             ↓
    ┌──────────────────────────────┐
    │ Display All Loans            │
    │ Status: PENDING/APPROVED/    │
    │         ACTIVE/CLOSED/       │
    │         DEFAULTED            │
    └────────┬─────────────────────┘
             │
        ┌────┴────┬────────────────────┐
        │          │                   │
        ↓          ↓                   ↓
    ┌──────────────────────┐  ┌──────────────────────┐
    │ VIEW LOAN DETAILS    │  │ CREATE NEW LOAN      │
    └──────────────────────┘  │                      │
                              │ Customer Selection: │
                              │ - Select from       │
                              │   dropdown          │
                              │                      │
                              │ Loan Parameters:    │
                              │ - Amount            │
                              │ - Purpose           │
                              │ - Tenure (months)   │
                              │ - Interest Rate     │
                              │ - (from settings)   │
                              └──────┬──────────────┘
                                     │
                                     ↓
                              ┌──────────────────────┐
                              │ System Auto-Calculates
                              │ EMI Formula:        │
                              │ ──────────────────  │
                              │ P = Principal       │
                              │ R = Monthly Rate    │
                              │ N = Months          │
                              │                    │
                              │ EMI = P*R(1+R)^N /│
                              │       (1+R)^N - 1  │
                              │                    │
                              │ Example:           │
                              │ ₹500,000, 8.5%, 60│
                              │ = ₹10,088.50/month│
                              └──────┬──────────────┘
                                     │
                                     ↓
                              ┌──────────────────────┐
                              │ Display Calculation: │
                              │ - Monthly EMI        │
                              │ - Total Interest     │
                              │ - Total Repayment    │
                              │ - First due date     │
                              │ Click "Create Loan"  │
                              └──────┬──────────────┘
                                     │
                                     ↓
                              ┌──────────────────────┐
                              │ POST /api/            │
                              │ loan_customers       │
                              │ Status: PENDING      │
                              │ Generated: USR1001   │
                              └──────┬──────────────┘
                                     │
                                     ↓
                              ┌──────────────────────┐
                              │ Loan Created ✓       │
                              │ Appears in list      │
                              │ Waiting for approval │
                              └──────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    LOAN APPROVAL FLOW (Manager)                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                          LOAN STATUS: PENDING                       │
│                                    │                                │
│                         Manager Reviews Loan:                       │
│                         ✓ Credit score check                        │
│                         ✓ Income verification                       │
│                         ✓ Document check                            │
│                         ✓ Risk assessment                           │
│                                    │                                │
│                         ┌──────────┴──────────┐                     │
│                         │                     │                     │
│                    APPROVE            REJECT                        │
│                         │                     │                     │
│                         ↓                     ↓                     │
│                    ┌─────────┐           ┌──────────┐              │
│                    │APPROVED │           │ REJECTED │              │
│                    └────┬────┘           └────┬─────┘              │
│                         │                     │                     │
│       Waiting for       │                     └─ Loan record        │
│       Disbursement      │                        updated, user      │
│                         │                        notified           │
│                         │                                          │
│                    Next Step: Finance                              │
│                    team disburses                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    LOAN DISBURSEMENT FLOW                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                       LOAN STATUS: APPROVED                         │
│                                    │                                │
│                    Finance clicks "Disburse"                        │
│                                    │                                │
│                         ┌──────────┴──────────┐                     │
│                         │                     │                     │
│                    PROCEED            CANCEL                        │
│                         │                     │                     │
│                         ↓                     ↓                     │
│                    ┌─────────┐           ┌──────────┐              │
│                    │ ACTIVE  │           │ Loan stays
                    │ Status  │           │ APPROVED   │              │
│                    └────┬────┘           └────┬─────┘              │
│                         │                     │                     │
│                Payment Cycle Begins:           │                     │
│                ✓ First payment due date set    │                     │
│                ✓ Customer can now make        │                     │
│                  payments                     │                     │
│                ✓ Dashboard tracks balance     │                     │
│                ✓ Overdue monitoring starts    │                     │
│                                               │                     │
│                                    Try Again Later                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    LOAN PAYMENT CYCLE                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                       LOAN STATUS: ACTIVE                           │
│                                    │                                │
│                ┌───────────────────┼───────────────────┐           │
│                │                   │                   │           │
│           ON DUE DATE        AFTER DUE DATE     FULL PAYMENT      │
│                │                   │                   │           │
│                ↓                   ↓                   ↓           │
│           Payment made      Marked OVERDUE      ┌─────────┐       │
│           on time           │                   │ CLOSED  │       │
│           ✓ Balance          Penalties          │ Status  │       │
│             updated          applied            └────┬────┘       │
│           ✓ Next due      Collections team       │                │
│             calculated    takes action           │                │
│           ✓ No penalty                           │                │
│                                                  Loan complete ✓   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ PAYMENT PROCESSING WORKFLOW

### Diagram: Complete Payment Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                    PAYMENT PROCESSING WORKFLOW                       │
└──────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │ Click "Payments"     │
    │ in Sidebar           │
    └─────────┬────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Display Payments List        │
    │ - Payment ID                 │
    │ - Loan ID                    │
    │ - Customer Name              │
    │ - Amount                     │
    │ - Method                     │
    │ - Date                       │
    │ - Status                     │
    └─────────┬────────────────────┘
              │
         ┌────┴──────────────────────┐
         │                           │
         ↓                           ↓
    ┌─────────────┐        ┌──────────────────┐
    │ VIEW PAYMENT│        │ RECORD NEW       │
    │ DETAILS     │        │ PAYMENT          │
    └─────────────┘        │                  │
                           │ Step 1: Select  │
                           │ Loan from       │
                           │ dropdown        │
                           │                  │
                           │ Auto-loads:     │
                           │ - Customer name │
                           │ - Current       │
                           │   balance       │
                           │ - Amount due    │
                           │ - Last payment  │
                           │   date          │
                           └──────┬──────────┘
                                  │
                                  ↓
                           ┌──────────────────┐
                           │ Step 2: Enter    │
                           │ Payment Details  │
                           │ - Amount Paid ₹  │
                           │ - Payment Date   │
                           │ - Payment Method │
                           │   * Cash         │
                           │   * Check        │
                           │   * Transfer     │
                           │   * Card         │
                           │   * Online       │
                           │ - Reference No   │
                           │ - Notes          │
                           └──────┬──────────┘
                                  │
                                  ↓
                           ┌──────────────────┐
                           │ Frontend         │
                           │ Validation:      │
                           │ ✓ Amount > 0     │
                           │ ✓ Amount ≤       │
                           │   balance        │
                           │ ✓ Date valid     │
                           │ ✓ Fields filled  │
                           └──────┬──────────┘
                                  │
                              ┌───┴───┐
                              │       │
                              ↓       ↓
                          INVALID  VALID
                              │       │
                              ↓       ↓
                          ERROR    ┌──────────────────┐
                          MESSAGE  │ POST /api/        │
                                   │ payments         │
                                   │ with payment    │
                                   │ details         │
                                   └──────┬──────────┘
                                          │
                                          ↓
                                   ┌──────────────────┐
                                   │ Backend          │
                                   │ Processing:      │
                                   │ 1. Validate loan │
                                   │    exists        │
                                   │ 2. Validate      │
                                   │    amount        │
                                   │ 3. Create        │
                                   │    payment       │
                                   │    record        │
                                   │ 4. Update loan:  │
                                   │    - Balance -   │
                                   │      payment     │
                                   │    - Next due    │
                                   │      date        │
                                   │    - Status      │
                                   │      (if paid    │
                                   │      in full)    │
                                   │ 5. Calculate     │
                                   │    interest      │
                                   │    accrued       │
                                   └──────┬──────────┘
                                          │
                                          ↓
                                   ┌──────────────────┐
                                   │ Success Response │
                                   │ - Payment ID     │
                                   │ - New Balance    │
                                   │ - Next Due Date  │
                                   │ - Loan Status    │
                                   │   (if changed)   │
                                   └──────┬──────────┘
                                          │
                                          ↓
                                   ┌──────────────────┐
                                   │ Success Toast    │
                                   │ "Payment of      │
                                   │  ₹50,000 done"   │
                                   │ "Balance:        │
                                   │  ₹450,000"       │
                                   │ "Next Due:       │
                                   │  23-May-2024"    │
                                   └──────┬──────────┘
                                          │
                                          ↓
                                   ┌──────────────────┐
                                   │ Update UI:       │
                                   │ - Add to list    │
                                   │ - Refresh        │
                                   │   dashboard      │
                                   │ - Update KPIs    │
                                   │ - Clear form     │
                                   └──────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    OVERDUE TRACKING FLOW                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Backend runs automated check every time dashboard loads:          │
│                                                                      │
│  FOR EACH active loan:                                              │
│    IF next_payment_due < TODAY:                                    │
│      THEN Mark as OVERDUE                                          │
│           Calculate days_overdue                                   │
│           Apply penalty (if configured)                            │
│           Add to overdue alerts                                    │
│                                                                      │
│  Dashboard displays:                                                │
│    ✓ Overdue count (KPI card)                                      │
│    ✓ Overdue loans table:                                          │
│      - Loan ID                                                     │
│      - Customer Name                                               │
│      - Days Overdue                                                │
│      - Amount at Risk                                              │
│      - Last Payment Date                                           │
│                                                                      │
│  Collections team can:                                              │
│    ✓ View overdue list                                             │
│    ✓ Send reminder (SMS/Email)                                     │
│    ✓ Make collection call                                          │
│    ✓ Record late payment (with penalty)                            │
│    ✓ Escalate to recovery                                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ DASHBOARD WORKFLOW

### Diagram: Dashboard Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD WORKFLOW                                │
└──────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐
    │ User logs in         │
    │ (authenticated)      │
    └─────────┬────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Redirect to /dashboard       │
    │ Dashboard component mounts   │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ useEffect hook triggers      │
    │ Calls fetchDashboard()       │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Frontend sends:              │
    │ GET /api/dashboard           │
    │ Authorization: Bearer {token}│
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Backend starts 5 parallel    │
    │ queries (Promise.allSettled) │
    └─────────┬────────────────────┘
              │
    ┌─────────┼─────────┬──────────┬──────────┐
    │         │         │          │          │
    ↓         ↓         ↓          ↓          ↓
  KPI      Recent   Overdue     Status    Monthly
 Query    Payments  Loans     Breakdown    Trend
  Query     Query    Query      Query      Query
    │         │         │          │          │
    ↓         ↓         ↓          ↓          ↓
 SELECT   SELECT    SELECT    SELECT    SELECT
 COUNT()  WHERE     WHERE     GROUP     WHERE
          ORDER BY  DATEDIFF  BY        DATE
          LIMIT 5   < 0       STATUS    ORDER
                              BY MONTH

    │         │         │          │          │
    └─────────┼─────────┴──────────┴──────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Collect all results          │
    │ Log any failures              │
    │ Return JSON response          │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Frontend receives data:       │
    │ - KPIs object                │
    │ - Recent payments array       │
    │ - Overdue loans array         │
    │ - Status breakdown array      │
    │ - Monthly trend array         │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Stop loading animation        │
    │ Display KPI cards:            │
    │ ┌─────┬─────┬─────┬─────┐   │
    │ │ Tot │ Tot │ Tot │Total│   │
    │ │Cust │Loan │Coll │Pend │   │
    │ └─────┴─────┴─────┴─────┘   │
    │ - Active Loans: 89            │
    │ - Overdue: 12                 │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Render tables:               │
    │ 1. Recent Payments (5 rows)  │
    │ 2. Overdue Alerts (5 rows)   │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Render charts:               │
    │ 1. Status Breakdown (Pie)    │
    │ 2. Monthly Trend (Line)      │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Dashboard Complete ✓         │
    │ User sees all metrics        │
    │ Real-time data displayed     │
    └──────────────────────────────┘

    ┌──────────────────────────────────────────┐
    │  USER INTERACTIONS ON DASHBOARD:         │
    │                                          │
    │  ✓ Refresh data (click refresh button)  │
    │  ✓ View payment details (click row)     │
    │  ✓ Navigate to payments page             │
    │  ✓ Navigate to loans page                │
    │  ✓ View complete list (expand button)   │
    └──────────────────────────────────────────┘
```

---

## 6️⃣ REPORTING WORKFLOW

### Diagram: Report Generation Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    REPORTING WORKFLOW                                │
└──────────────────────────────────────────────────────────────────────┘

    ┌────────────────────┐
    │ Click "Reports"    │
    │ in Sidebar         │
    └─────────┬──────────┘
              │
              ↓
    ┌────────────────────────────────┐
    │ Reports page loads             │
    │ Shows 4 report options:        │
    │ 1. Summary Report              │
    │ 2. Payments Report             │
    │ 3. Overdue Report              │
    │ 4. Customer Report             │
    └─────────┬──────────────────────┘
              │
    ┌─────────┼─────────┬──────────┬──────────┐
    │         │         │          │          │
    ↓         ↓         ↓          ↓          ↓
 SUMMARY   PAYMENTS  OVERDUE   CUSTOMER
 Report     Report    Report    Report
    │         │         │          │          │
    │         │         │          │          │
    ↓         ↓         ↓          ↓          ↓

    GET /api/reports/summary
    │
    ├─ getSummaryKPIs()
    │  SELECT COUNT(*), SUM() FROM loans, customers
    │
    ├─ getAllLoans()
    │  SELECT * FROM loans JOIN customers
    │
    ├─ getStatusBreakdown()
    │  SELECT status, COUNT(*) GROUP BY status
    │
    └─ getMonthlyDisbursement()
       SELECT MONTH, SUM(amount) GROUP BY MONTH

    ↓

    GET /api/reports/payments
    │
    ├─ getPaymentKPIs()
    │  SELECT SUM(amount), COUNT(*), AVG(amount)
    │
    └─ getAllPayments()
       SELECT * FROM payments JOIN loans, customers
       ORDER BY date DESC

    ↓

    GET /api/reports/overdue
    │
    ├─ getOverdueKPIs()
    │  SELECT SUM(balance), COUNT(*) WHERE due < TODAY
    │
    └─ getOverdueLoans()
       SELECT * WHERE next_due < TODAY
       ORDER BY days_overdue DESC

    ↓

    GET /api/reports/customers
    │
    ├─ getCustomerSummaryKPIs()
    │  SELECT COUNT(*) GROUP BY status
    │
    └─ getCustomerReport()
       SELECT * FROM customers
       WITH loan count JOIN

    ↓

    ┌──────────────────────────────┐
    │ Backend processes all data   │
    │ Formats response             │
    │ Returns JSON                 │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Frontend receives data       │
    │ Renders report view:         │
    │ - Summary metrics (KPIs)     │
    │ - Data table                 │
    │ - Charts/graphs              │
    └─────────┬────────────────────┘
              │
              ↓
    ┌──────────────────────────────┐
    │ Report displayed to user     │
    │ Can:                         │
    │ ✓ View all data              │
    │ ✓ Export to PDF              │
    │ ✓ Print report               │
    │ ✓ Switch reports             │
    │ ✓ Filter by date range       │
    └──────────────────────────────┘
```

---

## 7️⃣ COMPLETE USER JOURNEY MAP

```
┌────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER JOURNEY                               │
│                   (New Customer to Loan Closure)                       │
└────────────────────────────────────────────────────────────────────────┘

DAY 1: CUSTOMER ONBOARDING
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Morning: Loan Officer logs in                          │
│  → Dashboard loads → Customers page                     │
│                                                          │
│  Click "Add Customer":                                  │
│  → Customer form opens                                  │
│  → Fill all fields (personal, address, employment)     │
│  → Upload documents (ID, address, income, photo)       │
│  → Click "Save"                                         │
│  → Customer ID generated: CUST156                       │
│  → Toast: "Customer registered successfully"            │
│                                                          │
│  Customer now appears in list ✓                        │
│  Ready for loan application                            │
└──────────────────────────────────────────────────────────┘

DAY 2: LOAN APPLICATION
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Customer: "I want a home loan of ₹500,000"            │
│                                                          │
│  Loan Officer navigates to Loans                       │
│  → Click "New Loan"                                    │
│  → Form opens                                          │
│  → Select Customer: CUST156                            │
│  → Loan Amount: ₹500,000                               │
│  → Purpose: Home Loan                                  │
│  → Tenure: 60 months                                   │
│  → Interest Rate: 8.5% (from settings)                 │
│                                                          │
│  System calculates:                                    │
│  → Monthly EMI: ₹10,088.50                             │
│  → Total Interest: ₹105,310                            │
│  → Total Repayment: ₹605,310                           │
│                                                          │
│  → Click "Create Loan"                                 │
│  → Loan ID generated: USR1001                          │
│  → Status: PENDING                                     │
│  → Appears in list                                     │
│                                                          │
│  Waiting for approval ⏳                               │
└──────────────────────────────────────────────────────────┘

DAY 3: LOAN APPROVAL
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Manager reviews all pending loans                      │
│  → Sees USR1001                                        │
│  → Clicks to view details                              │
│                                                          │
│  Verification:                                         │
│  ✓ Credit score: 720 (Good)                           │
│  ✓ Income: ₹75,000/month (Sufficient)                 │
│  ✓ Documents: All uploaded                            │
│  ✓ Risk Assessment: LOW                               │
│                                                          │
│  → Click "Approve Loan"                                │
│  → Status: PENDING → APPROVED                          │
│  → Confirmation sent to customer                       │
│  → Waiting for disbursement                            │
│                                                          │
│  Finance team can now process 💰                        │
└──────────────────────────────────────────────────────────┘

DAY 4: LOAN DISBURSEMENT
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Finance team processes approved loans                  │
│  → Sees USR1001 with APPROVED status                  │
│  → Click "Disburse Loan"                              │
│  → Confirms disbursement amount: ₹500,000             │
│  → Money transferred to customer's account             │
│  → Status: APPROVED → ACTIVE                          │
│  → Payment cycle begins                                │
│  → First payment due: 23-May-2024                     │
│                                                          │
│  Loan is now LIVE ✓                                    │
│  Customer can start making payments                    │
└──────────────────────────────────────────────────────────┘

MONTH 1-5 BEFORE DUE DATE (May 21):
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  2 days before due date:                               │
│  → System sends SMS reminder                           │
│  → SMS: "Payment of ₹10,089 due on 23-May"           │
│  → System sends Email reminder                         │
│  → Email with payment details                          │
│                                                          │
│  Customer prepares for payment 📝                       │
└──────────────────────────────────────────────────────────┘

MONTH 1 ON DUE DATE (May 23):
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Customer makes payment                                 │
│  → Initiates bank transfer: ₹10,089                   │
│  → Money received by company                           │
│                                                          │
│  Collections team records payment:                      │
│  → Navigate to Payments page                           │
│  → Click "Record Payment"                              │
│  → Select Loan: USR1001                               │
│  → Auto-loads: Balance ₹500,000, Due ₹10,089         │
│  → Enter Amount: ₹10,089                              │
│  → Method: Transfer                                    │
│  → Date: 23-May-2024                                  │
│  → Click "Submit Payment"                              │
│                                                          │
│  Backend processes:                                    │
│  → Create payment record                              │
│  → Update balance: 500,000 - 10,089 = ₹489,911      │
│  → Calculate interest accrued                          │
│  → Set next due date: 23-June-2024                   │
│  → Status remains: ACTIVE                             │
│                                                          │
│  → Success Toast: "Payment recorded"                   │
│  → Payment appears in list                             │
│  → Dashboard KPIs update:                             │
│    * Total Collected increases                        │
│    * Total Pending decreases                          │
│    * Active Loans: Still 89                           │
│                                                          │
│  Payment successful ✓                                  │
│  Next payment due: 23-June-2024                       │
└──────────────────────────────────────────────────────────┘

MONTHS 2-60: REPEAT PAYMENT CYCLE
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Each month:                                           │
│  → SMS reminder 2 days before                          │
│  → Customer makes payment                             │
│  → Collections team records it                        │
│  → System updates balance                             │
│  → Dashboard reflects changes                         │
│  → Process repeats...                                 │
│                                                          │
│  IF PAYMENT LATE (after 5-day grace):                │
│  → Status changes to OVERDUE                          │
│  → Appears in overdue alerts                          │
│  → Collections team follows up                        │
│  → Late payment penalty applied                       │
│                                                          │
│  IF PAYMENT MADE LATE:                                │
│  → Record with penalty amount                         │
│  → Update next due date                               │
│  → Status remains ACTIVE                              │
│  → Continue normal cycle                              │
└──────────────────────────────────────────────────────────┘

MONTH 60: FINAL PAYMENT
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  5 years later, month 60 (April 2029):                │
│  → Last EMI due: ₹10,089                              │
│  → SMS reminder sent                                  │
│  → Customer makes final payment                       │
│                                                          │
│  Collections team:                                    │
│  → Record final payment: ₹10,089                     │
│  → System calculates:                                 │
│    * Total paid: ₹605,340                            │
│    * Balance: ₹0                                      │
│  → Status changes: ACTIVE → CLOSED                    │
│                                                          │
│  Confirmation email to customer:                       │
│  ┌──────────────────────────────────────────┐         │
│  │ Loan Closure Notification               │         │
│  │ ──────────────────────────────────────  │         │
│  │ Loan ID: USR1001                        │         │
│  │ Customer: Rajesh Kumar                  │         │
│  │ Total Amount Paid: ₹605,340            │         │
│  │ Loan Status: CLOSED ✓                   │         │
│  │                                          │         │
│  │ Thank you for choosing our services!   │         │
│  └──────────────────────────────────────────┘         │
│                                                          │
│  Dashboard shows:                                     │
│  → Active Loans: 88 (decreased by 1)                  │
│  → Total Collected: ₹2,505,340                        │
│  → Loan appears in CLOSED status                      │
│                                                          │
│  Loan cycle complete ✓                                │
└──────────────────────────────────────────────────────────┘

ANYTIME: REPORTS & ANALYTICS
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Manager wants business insights:                       │
│                                                          │
│  → Click "Dashboard"                                   │
│  → See all KPIs updated in real-time                  │
│  → See recent payments including this one             │
│  → See collection trend improving                     │
│                                                          │
│  → Click "Reports"                                     │
│  → Select "Summary Report"                            │
│  → See:                                               │
│    * 156 total customers                              │
│    * 342 total loans                                  │
│    * ₹2.5 Cr collected                                │
│    * ₹5.6 Cr pending                                  │
│    * Loan status breakdown                            │
│    * Monthly collection trend                         │
│  → Export report as PDF                               │
│                                                          │
│  Business intelligence available ✓                     │
└──────────────────────────────────────────────────────────┘
```

---

## 8️⃣ API COMMUNICATION FLOW

```
┌────────────────────────────────────────────────────────────────────────┐
│            HOW FRONTEND & BACKEND COMMUNICATE                          │
└────────────────────────────────────────────────────────────────────────┘

FRONTEND (React)              HTTP REQUEST              BACKEND (Node.js)
                              ──────────→

User Action
  │
  ├─ Click button
  ├─ Submit form
  ├─ Load page
  └─ Select dropdown
       │
       ↓
  JavaScript Event Handler
       │
       ├─ Validate input
       ├─ Prepare data
       ├─ Add JWT token
       └─ Choose HTTP method
            │
            ↓
       API Request (Axios)
       ┌──────────────────────────────────┐
       │ POST /api/customers              │
       │ Headers: {                       │
       │   Authorization: Bearer {token}  │
       │   Content-Type: application/json │
       │ }                                │
       │ Body: {                          │
       │   firstName: "Rajesh",           │
       │   lastName: "Kumar",             │
       │   email: "rajesh@...",           │
       │   ...                            │
       │ }                                │
       └──────────────────────────────────┘
              │
              ↓
           Network
              │
              ↓
       Express Router
       │
       ├─ Matches route: POST /api/customers
       └─ Calls customerController.createCustomer()
              │
              ↓
       Middleware Chain
       │
       ├─ authMiddleware (validates token)
       ├─ validationMiddleware (checks data)
       ├─ loggingMiddleware (logs request)
       └─ Continue to controller
              │
              ↓
       Controller (createCustomer)
       │
       ├─ Extract data from req.body
       ├─ Call model function
       └─ Return response
              │
              ↓
       Model (customerModel)
       │
       ├─ Build SQL query
       ├─ Execute query
       ├─ Process results
       └─ Return to controller
              │
              ↓
       Database (MySQL)
       │
       ├─ Execute SQL
       ├─ Insert data
       ├─ Return success/error
       └─ Return to model
              │
              ↓
       Controller constructs response
       ┌──────────────────────────────────┐
       │ Response (201 Created):          │
       │ {                                │
       │   message: "Customer created",   │
       │   customerId: "CUST156"          │
       │ }                                │
       └──────────────────────────────────┘
              │
              ↓
           Network
              │
              ↓
       Frontend receives response
       │
       ├─ Response interceptor processes
       ├─ Checks status code (201 = success)
       ├─ Parses JSON
       └─ Returns to caller
              │
              ↓
       Component updates state
       │
       ├─ setCustomers([...new customer])
       ├─ setSuccess(true)
       └─ setLoading(false)
              │
              ↓
       React re-renders
       │
       ├─ DOM updates
       ├─ Toast shows success message
       ├─ List refreshes with new customer
       └─ Form clears
              │
              ↓
       User sees "Customer created: CUST156"
       New customer appears in list
       Success ✓

←──────────

   ERROR HANDLING:
   ─────────────

   If error occurs:
   1. Backend catches exception
   2. Sends error response (400/500)
   3. Frontend detects error status
   4. Shows error toast to user
   5. User can retry or fix issue
```

---

**All workflows documented with complete visual representation of the application flow from login to reporting!**
