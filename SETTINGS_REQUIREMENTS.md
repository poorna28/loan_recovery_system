# Settings Menus - Functional Requirements & Implementation Plan

## Overview
The Settings module manages system-wide configurations for the Loan Recovery System. It consists of 7 main sections, each handling different configuration aspects.

---

## Settings Menus Structure

### 1. **Company Profile** 
**Purpose:** Store and display company information

**Fields:**
- Company Name
- Registration Number (CIN)
- GSTIN
- Support Phone
- Registered Address

**Database Table:** `settings_company`

**API Endpoints:**
- `GET /api/settings/company-profile` - Fetch company settings
- `PUT /api/settings/company-profile` - Update company settings

---

### 2. **Interest Rates**
**Purpose:** Configure interest rates per loan type

**Fields:**
- Default Annual Rate (%)
- Personal Loan Rate (%)
- Business Loan Rate (%)
- Gold Loan Rate (%)
- Monthly Rate (calculated)
- Daily Rate (calculated)

**Database Table:** `settings_interest_rates`

**API Endpoints:**
- `GET /api/settings/interest-rates` - Fetch current rates
- `PUT /api/settings/interest-rates` - Update rates

**Key Logic:**
- Monthly Rate = Annual Rate / 12
- Daily Rate = Annual Rate / 365
- Changes apply to new loans only

---

### 3. **Loan Configuration**
**Purpose:** Define loan term and amount limits, EMI rules

**Fields:**
- **Loan Term Limits:**
  - Minimum Tenure (months)
  - Maximum Tenure (months)
  - Default Tenure (months)

- **Loan Amount Limits:**
  - Minimum Amount (₹)
  - Maximum Amount (₹)
  - EMI Calculation Method

- **Penalty Rules:**
  - Late Fee (₹)
  - Penalty Rate (%)
  - Grace Period (days)

**Database Table:** `settings_loan_config`

**API Endpoints:**
- `GET /api/settings/loan-config` - Fetch loan configuration
- `PUT /api/settings/loan-config` - Update configuration

---

### 4. **Payment Methods**
**Purpose:** Enable/disable payment methods and set payment rules

**Fields:**
- **Accepted Payment Modes:**
  - Cash
  - UPI
  - Bank Transfer
  - Debit Card
  - Net Banking
  - Cheque / DD

- **Payment Rules:**
  - Auto Receipt Generation
  - Allow Partial Payments
  - Allow Advance Payments
  - Round Off Amount

**Database Table:** `settings_payment_methods`

**API Endpoints:**
- `GET /api/settings/payment-methods` - Fetch payment settings
- `PUT /api/settings/payment-methods` - Update settings

---

### 5. **Users & Roles**
**Purpose:** Manage staff members and their access levels

**Fields:**
- User Name
- Email
- Role (Super Admin, Manager, Agent, etc.)
- Status (Active, Inactive)
- Permissions (Viewing, Editing, etc.)

**Database Tables:**
- `users` - User information
- `roles` - Role definitions
- `role_permissions` - Role-to-permission mapping
- `user_roles` - User-to-role assignment

**API Endpoints:**
- `GET /api/settings/users` - List all users
- `GET /api/settings/users/:id` - Get user details
- `POST /api/settings/users` - Create new user
- `PUT /api/settings/users/:id` - Update user
- `DELETE /api/settings/users/:id` - Delete user
- `GET /api/settings/roles` - List all roles
- `POST /api/settings/roles` - Create role
- `PUT /api/settings/roles/:id` - Update role

---

### 6. **Notifications**
**Purpose:** Configure automated customer notifications

**Fields:**
- **Customer Notifications:**
  - Payment Confirmation SMS (toggle)
  - EMI Due Reminder SMS (toggle)
  - Overdue Alert SMS (toggle)
  - Loan Closure SMS (toggle)

- **SMS Provider Settings:**
  - SMS Provider (Twilio, AWS SNS, etc.)
  - Sender ID

- **Email Settings:**
  - SMTP Configuration
  - Email Templates

**Database Table:** `settings_notifications`

**API Endpoints:**
- `GET /api/settings/notifications` - Fetch notification settings
- `PUT /api/settings/notifications` - Update settings
- `POST /api/settings/notifications/test-sms` - Send test SMS
- `POST /api/settings/notifications/test-email` - Send test email

---

### 7. **Danger Zone**
**Purpose:** Manage critical system operations

**Features:**
- Reset all settings to factory defaults
- Export full database backup (JSON)
- Purge all test/demo data

**Database Tables:** None (operations only)

**API Endpoints:**
- `POST /api/settings/danger-zone/reset` - Reset settings
- `GET /api/settings/danger-zone/export` - Export backup
- `POST /api/settings/danger-zone/purge` - Purge test data
- `POST /api/settings/danger-zone/restore` - Restore from backup

---

## Database Schema

```sql
-- Company Profile Settings
CREATE TABLE IF NOT EXISTS settings_company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    gstin VARCHAR(15),
    support_phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Interest Rates
CREATE TABLE IF NOT EXISTS settings_interest_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    default_rate DECIMAL(5,2) NOT NULL,
    personal_rate DECIMAL(5,2),
    business_rate DECIMAL(5,2),
    gold_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Loan Configuration
CREATE TABLE IF NOT EXISTS settings_loan_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    min_tenure INT,
    max_tenure INT,
    default_tenure INT,
    min_amount DECIMAL(10,2),
    max_amount DECIMAL(10,2),
    emi_method VARCHAR(100),
    late_fee DECIMAL(10,2),
    penalty_rate DECIMAL(5,2),
    grace_period INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS settings_payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(100),
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payment Method Settings (Meta)
CREATE TABLE IF NOT EXISTS settings_payment_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auto_receipt BOOLEAN DEFAULT TRUE,
    allow_partial BOOLEAN DEFAULT FALSE,
    allow_advance BOOLEAN DEFAULT TRUE,
    round_off BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notification Settings
CREATE TABLE IF NOT EXISTS settings_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_confirmation BOOLEAN DEFAULT TRUE,
    emi_reminder BOOLEAN DEFAULT TRUE,
    overdue_alert BOOLEAN DEFAULT TRUE,
    loan_closure BOOLEAN DEFAULT TRUE,
    sms_provider VARCHAR(100),
    sms_sender_id VARCHAR(20),
    smtp_host VARCHAR(255),
    smtp_port INT,
    smtp_username VARCHAR(255),
    smtp_password VARCHAR(255),
    smtp_from VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permission Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- User Roles
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Audit Log (Track Settings Changes)
CREATE TABLE IF NOT EXISTS settings_audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    setting_type VARCHAR(100),
    old_value JSON,
    new_value JSON,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## Backend Implementation

### File Structure
```
/server
  /controllers
    - settingsController.js
  /models
    - settingsModel.js
  /routes
    - settingsRoutes.js
  /utils
    - settingsDefaults.js
    - settingsValidator.js
```

### Controllers to Create
1. `getCompanyProfile()`, `updateCompanyProfile()`
2. `getInterestRates()`, `updateInterestRates()`
3. `getLoanConfig()`, `updateLoanConfig()`
4. `getPaymentMethods()`, `updatePaymentMethods()`
5. `getNotifications()`, `updateNotifications()`
6. `getUsers()`, `createUser()`, `updateUser()`, `deleteUser()`
7. `getRoles()`, `createRole()`, `updateRole()`
8. `resetSettings()`, `exportBackup()`, `purgeTestData()`

---

## Frontend Implementation

### Pages to Update
1. `/client/src/pages/Settings/Company-Profile/company-profile.js`
2. `/client/src/pages/Settings/Intrest-Rate/intrest-rate.js`
3. `/client/src/pages/Settings/Loan-Config/loan-config.js`
4. `/client/src/pages/Settings/Payment-Methods/payment-methods.js`
5. `/client/src/pages/Settings/Users-Roles/user-role.js`
6. `/client/src/pages/Settings/Notifications/notifications.js`
7. `/client/src/pages/Settings/Danger-Zone/danger-zone.js`

### Features to Add to Each Page
- Fetch settings on component mount via API
- Display loading state while fetching
- Handle form validation
- Save changes to backend
- Show success/error toasts
- Track dirty state (unsaved changes)
- Use buildUrl and buildPayload utilities

---

## API Response Format

### Standard Success Response
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "id": 1,
    "setting_type": "company_profile",
    "settings": { ... }
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Company name is required",
    "Phone number format invalid"
  ]
}
```

---

## Implementation Priority

**Phase 1 (MVP):**
1. Company Profile
2. Interest Rates
3. Loan Configuration

**Phase 2:**
4. Payment Methods
5. Notifications

**Phase 3:**
6. Users & Roles
7. Danger Zone

---

## Testing Checklist

- [ ] GET endpoints return correct data
- [ ] PUT endpoints validate input properly
- [ ] POST endpoints create records correctly
- [ ] DELETE endpoints remove records safely
- [ ] Error handling works (invalid input, server errors)
- [ ] Frontend forms load data correctly
- [ ] Save functionality works
- [ ] Toast notifications display
- [ ] Audit logging captures changes
- [ ] Permissions are checked for sensitive operations
- [ ] Database constraints are enforced
- [ ] API responses match expected format

