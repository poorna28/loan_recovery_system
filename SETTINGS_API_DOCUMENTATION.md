# Settings Management System - API Documentation

## Overview

The Settings Management System provides a comprehensive API for managing all system configurations in the Loan Recovery System. All settings endpoints are protected with authentication middleware and include audit logging for compliance and security.

## Base URL

```
/api/settings
```

## Authentication

All endpoints require valid authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Response Format

All responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "settings": { /* data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Field is required", "Field must be a number"]
}
```

---

## 1. Company Profile Settings

### Get Company Profile
```
GET /api/settings/company-profile
```

**Response:**
```json
{
  "success": true,
  "message": "Company settings retrieved successfully",
  "settings": {
    "id": 1,
    "company_name": "LoanPro Finance Pvt. Ltd.",
    "registration_number": "CIN: U65929TG2020PTC142857",
    "gstin": "36AABCL1234A1ZX",
    "support_phone": "+91 98765 43210",
    "address": "Plot 42, HITEC City, Hyderabad, Telangana - 500081",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update Company Profile
```
PUT /api/settings/company-profile
```

**Request Body:**
```json
{
  "company_name": "LoanPro Finance Pvt. Ltd.",
  "registration_number": "CIN: U65929TG2020PTC142857",
  "gstin": "36AABCL1234A1ZX",
  "support_phone": "+91 98765 43210",
  "address": "Plot 42, HITEC City, Hyderabad, Telangana - 500081"
}
```

**Validation Rules:**
- `company_name`: Required, max 255 characters
- `registration_number`: Optional, max 100 characters
- `gstin`: Optional, max 15 characters
- `support_phone`: Optional, max 20 characters
- `address`: Optional, max 5000 characters

---

## 2. Interest Rates Settings

### Get Interest Rates
```
GET /api/settings/interest-rates
```

**Response:**
```json
{
  "success": true,
  "message": "Interest rates retrieved successfully",
  "settings": {
    "id": 1,
    "default_rate": 18.00,
    "personal_rate": 18.00,
    "business_rate": 14.00,
    "gold_rate": 12.00,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update Interest Rates
```
PUT /api/settings/interest-rates
```

**Request Body:**
```json
{
  "default_rate": 18.00,
  "personal_rate": 18.00,
  "business_rate": 14.00,
  "gold_rate": 12.00
}
```

**Validation Rules:**
- All rates required
- Must be numbers between 0 and 100
- Represent annual percentage rates (APR)

---

## 3. Loan Configuration Settings

### Get Loan Configuration
```
GET /api/settings/loan-config
```

**Response:**
```json
{
  "success": true,
  "message": "Loan configuration retrieved successfully",
  "settings": {
    "id": 1,
    "min_tenure": 3,
    "max_tenure": 60,
    "default_tenure": 12,
    "min_amount": 5000.00,
    "max_amount": 1000000.00,
    "emi_method": "Reducing Balance",
    "late_fee": 200.00,
    "penalty_rate": 2.00,
    "grace_period": 3,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update Loan Configuration
```
PUT /api/settings/loan-config
```

**Request Body:**
```json
{
  "min_tenure": 3,
  "max_tenure": 60,
  "default_tenure": 12,
  "min_amount": 5000.00,
  "max_amount": 1000000.00,
  "emi_method": "Reducing Balance",
  "late_fee": 200.00,
  "penalty_rate": 2.00,
  "grace_period": 3
}
```

**Validation Rules:**
- `min_tenure`: Required integer (1-360 months)
- `max_tenure`: Required integer (1-360 months), must be >= min_tenure
- `default_tenure`: Required integer, must be between min and max
- `min_amount`: Required decimal (>= 0)
- `max_amount`: Required decimal, must be >= min_amount
- `emi_method`: Required, one of: "Reducing Balance", "Flat Rate", "Simple Interest"
- `late_fee`: Required decimal (>= 0)
- `penalty_rate`: Required decimal (0-100, percentage)
- `grace_period`: Required integer (0-180 days)

---

## 4. Payment Methods & Payment Rules Settings

### Get Payment Settings
```
GET /api/settings/payment-methods
```

**Response:**
```json
{
  "success": true,
  "message": "Payment settings retrieved successfully",
  "settings": {
    "methods": [
      {
        "id": 1,
        "method_name": "Cash",
        "is_enabled": true,
        "icon": "💵",
        "description": "In-person collection",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 2,
        "method_name": "UPI",
        "is_enabled": true,
        "icon": "📱",
        "description": "GPay, PhonePe, BHIM",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "rules": {
      "id": 1,
      "auto_receipt": true,
      "allow_partial": false,
      "allow_advance": true,
      "round_off": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Update Payment Settings
```
PUT /api/settings/payment-methods
```

**Request Body:**
```json
{
  "methods": [
    {
      "id": 1,
      "is_enabled": true
    },
    {
      "id": 2,
      "is_enabled": false
    }
  ],
  "rules": {
    "auto_receipt": true,
    "allow_partial": false,
    "allow_advance": true,
    "round_off": true
  }
}
```

**Validation Rules:**
- `methods`: Array of payment method updates with `id` and `is_enabled` (boolean)
- `auto_receipt`: Boolean - Auto-generate payment receipts
- `allow_partial`: Boolean - Allow partial payment of EMI
- `allow_advance`: Boolean - Allow advance payments
- `round_off`: Boolean - Round off payment amounts

---

## 5. Notifications Settings

### Get Notifications
```
GET /api/settings/notifications
```

**Response:**
```json
{
  "success": true,
  "message": "Notification settings retrieved successfully",
  "settings": {
    "id": 1,
    "payment_confirmation": true,
    "emi_reminder": true,
    "overdue_alert": true,
    "loan_closure": true,
    "sms_provider": "Twilio",
    "sms_sender_id": "LOANPRO",
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_username": "noreply@loanpro.com",
    "smtp_password": "***encrypted***",
    "smtp_from": "noreply@loanpro.com",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Update Notifications
```
PUT /api/settings/notifications
```

**Request Body:**
```json
{
  "payment_confirmation": true,
  "emi_reminder": true,
  "overdue_alert": true,
  "loan_closure": true,
  "sms_provider": "Twilio",
  "sms_sender_id": "LOANPRO",
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_username": "noreply@loanpro.com",
  "smtp_password": "app-specific-password",
  "smtp_from": "noreply@loanpro.com"
}
```

**Validation Rules:**
- `payment_confirmation`: Boolean
- `emi_reminder`: Boolean
- `overdue_alert`: Boolean
- `loan_closure`: Boolean
- `sms_provider`: Optional string, max 100 characters
- `sms_sender_id`: Optional string, max 20 characters
- `smtp_host`: Optional string, max 255 characters
- `smtp_port`: Optional integer (1-65535)
- `smtp_username`: Optional string, max 255 characters
- `smtp_from`: Optional email address, max 255 characters

---

## 6. User Management

### Get All Users
```
GET /api/settings/users?page=1&limit=10&search=
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 10)
- `search`: Search by user ID or name (optional)

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "user_id": "USR1001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "roles": "Admin,Manager",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### Get User Roles
```
GET /api/settings/users/:userId/roles
```

**Response:**
```json
{
  "success": true,
  "message": "User roles retrieved successfully",
  "data": [
    {
      "id": 1,
      "role_name": "Admin",
      "description": "Full system access with all permissions"
    },
    {
      "id": 2,
      "role_name": "Manager",
      "description": "Can manage loans, customers, payments, and reports"
    }
  ]
}
```

### Update User Roles
```
PUT /api/settings/users/:userId/roles
```

**Request Body:**
```json
{
  "roleIds": [1, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "User roles updated successfully",
  "data": {
    "userId": "USR1001",
    "roleIds": [1, 3]
  }
}
```

### Delete User
```
DELETE /api/settings/users/:userId
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "userId": "USR1001"
  }
}
```

---

## 7. Roles Management

### Get All Roles with Permissions
```
GET /api/settings/roles
```

**Response:**
```json
{
  "success": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": 1,
      "role_name": "Admin",
      "description": "Full system access with all permissions",
      "is_system_role": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "permissions": [
        {
          "id": 1,
          "permission_name": "view_customers",
          "module": "Customers",
          "description": "View customer list"
        },
        {
          "id": 2,
          "permission_name": "create_customer",
          "module": "Customers",
          "description": "Create new customer"
        }
      ]
    }
  ]
}
```

---

## 8. System Operations

### Reset All Settings to Defaults
```
POST /api/settings/reset
```

**Note:** This is a destructive operation. All custom settings will be reset to default values. Please use with caution.

**Response:**
```json
{
  "success": true,
  "message": "All settings have been reset to default values"
}
```

### Get Audit Log
```
GET /api/settings/audit-log?settingType=COMPANY_PROFILE&days=30
```

**Query Parameters:**
- `settingType`: Setting section type (e.g., COMPANY_PROFILE, INTEREST_RATES, LOAN_CONFIG, etc.)
- `days`: Number of days to look back (default: 30)

**Response:**
```json
{
  "success": true,
  "message": "Audit log retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": "USR1001",
      "setting_type": "COMPANY_PROFILE",
      "action": "UPDATE",
      "old_value": {
        "company_name": "Old Name"
      },
      "new_value": {
        "company_name": "New Name"
      },
      "changed_at": "2024-01-15T10:30:00.000Z",
      "ip_address": "192.168.1.1"
    }
  ]
}
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing or invalid authentication token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Usage Examples

### Example 1: Update Interest Rates

**Request:**
```bash
curl -X PUT http://localhost:5000/api/settings/interest-rates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "default_rate": 19.50,
    "personal_rate": 20.00,
    "business_rate": 15.00,
    "gold_rate": 13.00
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Interest rates updated successfully",
  "settings": {
    "default_rate": 19.50,
    "personal_rate": 20.00,
    "business_rate": 15.00,
    "gold_rate": 13.00
  }
}
```

### Example 2: Get Users with Pagination

**Request:**
```bash
curl -X GET "http://localhost:5000/api/settings/users?page=1&limit=5&search=john" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "user_id": "USR1005",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "roles": "Manager"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 1,
      "pages": 1
    }
  }
}
```

### Example 3: Update Payment Methods

**Request:**
```bash
curl -X PUT http://localhost:5000/api/settings/payment-methods \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "methods": [
      { "id": 1, "is_enabled": true },
      { "id": 2, "is_enabled": false },
      { "id": 3, "is_enabled": true }
    ],
    "rules": {
      "auto_receipt": true,
      "allow_partial": true,
      "allow_advance": true,
      "round_off": false
    }
  }'
```

---

## Security & Best Practices

1. **Authentication:** All endpoints require valid JWT token in Authorization header
2. **Audit Logging:** All changes are automatically logged with user ID, timestamp, old/new values, and IP address
3. **Input Validation:** All inputs are validated server-side before processing
4. **Rate Limiting:** API requests are rate-limited to prevent abuse
5. **Data Sanitization:** All string inputs are sanitized to prevent SQL injection
6. **Sensitive Data:** SMTP password (if stored) should never be returned in responses

---

## Notes for Frontend Integration

When integrating settings pages with this API:

1. Use the queryBuilder utility from Phase 1 for consistent request patterns
2. Always include loading states while fetching data
3. Show toast notifications for success/error messages
4. Implement proper error handling and display validation error messages
5. Add confirmation dialogs for destructive operations (delete user, reset settings)
6. Cache settings data in Redux/Context to avoid multiple API calls
7. Implement optimistic updates for better UX
8. Display audit log changes when viewing historical data
