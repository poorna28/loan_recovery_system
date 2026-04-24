# Backend API Updates - Implementation Guide

## Overview
This guide outlines the backend changes needed to accept and process the new query parameters for filtering, sorting, and pagination.

## Query Parameters to Support

All list endpoints should accept these query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search term (searches across name, email, phone, etc.) | `search=john` |
| `sortBy` | string | Field to sort by | `sortBy=firstName` |
| `sortOrder` | string | Sort order: 'asc' or 'desc' | `sortOrder=asc` |
| `page` | number | Page number (1-indexed) | `page=1` |
| `limit` | number | Records per page | `limit=50` |

## Customers Endpoint

### GET `/api/customers`

**Query Parameters:**
- `search`: Filter by firstName, lastName, email, phoneNumber
- `sortBy`: firstName, lastName, email, profileStatus, etc.
- `sortOrder`: asc, desc
- `page`: 1-100
- `limit`: 10-500
- `profileStatus`: Filter by status (Active, Inactive, etc.)
- `employmentStatus`: Filter by employment (Employed, Self-employed, etc.)

**Example Request:**
```
GET /api/customers?search=john&sortBy=firstName&sortOrder=asc&page=1&limit=50&profileStatus=Active
```

**Implementation (Node.js/Express):**
```javascript
exports.getAllCustomers = async (req, res) => {
  try {
    const { search, sortBy = 'firstName', sortOrder = 'asc', page = 1, limit = 50, profileStatus, employmentStatus } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Status filters
    if (profileStatus) query.profileStatus = profileStatus;
    if (employmentStatus) query.employmentStatus = employmentStatus;
    
    // Sorting
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    
    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(500, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * pageSize;
    
    // Execute query
    const customers = await db.query('SELECT * FROM customers WHERE ... ORDER BY ... LIMIT ? OFFSET ?');
    const total = await db.query('SELECT COUNT(*) FROM customers WHERE ...');
    
    res.json({
      customers,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: total[0].count,
        pages: Math.ceil(total[0].count / pageSize)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
```

---

## Loan Customers Endpoint

### GET `/api/loan_customers`

**Query Parameters:**
- `search`: Filter by loan purpose, customer name, etc.
- `sortBy`: applicationDate, loanAmount, remainingBalance, etc.
- `sortOrder`: asc, desc
- `page`: 1-100
- `limit`: 10-500
- `loanStatus`: Filter by status (ACTIVE, PENDING, APPROVED, REJECTED)

**Example Request:**
```
GET /api/loan_customers?search=business&sortBy=applicationDate&sortOrder=desc&page=1&limit=50&loanStatus=ACTIVE
```

**Implementation:**
```javascript
exports.getAllLoanCustomers = async (req, res) => {
  try {
    const { search, sortBy = 'applicationDate', sortOrder = 'desc', page = 1, limit = 50, loanStatus } = req.query;
    
    let query = `SELECT * FROM loan_customers WHERE 1=1`;
    const params = [];
    
    // Search filter
    if (search) {
      query += ` AND (loan_purpose LIKE ? OR customer_id IN (SELECT id FROM customers WHERE firstName LIKE ? OR lastName LIKE ?))`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Status filter
    if (loanStatus) {
      query += ` AND status_approved = ?`;
      params.push(loanStatus);
    }
    
    // Sorting
    const sortColumn = sanitizeColumnName(sortBy); // Prevent SQL injection
    const sortDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortColumn} ${sortDir}`;
    
    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(500, Math.max(1, parseInt(limit) || 50));
    const offset = (pageNum - 1) * pageSize;
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);
    
    const loans = await db.query(query, params);
    
    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM loan_customers WHERE 1=1`;
    const countParams = [];
    if (search) {
      countQuery += ` AND (loan_purpose LIKE ? OR customer_id IN (SELECT id FROM customers WHERE firstName LIKE ? OR lastName LIKE ?))`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (loanStatus) {
      countQuery += ` AND status_approved = ?`;
      countParams.push(loanStatus);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      loan_customers: loans,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
```

---

## Payments Endpoint

### GET `/api/payments`

**Query Parameters:**
- `search`: Filter by loan ID, payment method, etc.
- `sortBy`: paymentDate, amountPaid, principal, etc.
- `sortOrder`: asc, desc
- `page`: 1-100
- `limit`: 10-500
- `paymentMethod`: Filter by method (CASH, BANK_TRANSFER, etc.)

**Example Request:**
```
GET /api/payments?search=loan&sortBy=paymentDate&sortOrder=desc&page=1&limit=50&paymentMethod=CASH
```

**Implementation:**
```javascript
exports.getAllPayments = async (req, res) => {
  try {
    const { search, sortBy = 'paymentDate', sortOrder = 'desc', page = 1, limit = 50, paymentMethod } = req.query;
    
    let query = `SELECT * FROM payments WHERE 1=1`;
    const params = [];
    
    // Search filter
    if (search) {
      query += ` AND (loan_id LIKE ? OR payment_method LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Payment method filter
    if (paymentMethod) {
      query += ` AND payment_method = ?`;
      params.push(paymentMethod);
    }
    
    // Sorting
    const sortColumn = sanitizeColumnName(sortBy);
    const sortDir = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortColumn} ${sortDir}`;
    
    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(500, Math.max(1, parseInt(limit) || 50));
    const offset = (pageNum - 1) * pageSize;
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);
    
    const payments = await db.query(query, params);
    
    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM payments WHERE 1=1`;
    const countParams = [];
    if (search) {
      countQuery += ` AND (loan_id LIKE ? OR payment_method LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (paymentMethod) {
      countQuery += ` AND payment_method = ?`;
      countParams.push(paymentMethod);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = countResult[0].total;
    
    res.json({
      payments,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
```

---

## Dashboard Endpoint

### GET `/api/dashboard`

**Query Parameters:**
- `dateRange`: 'all', 'today', 'week', 'month', 'year'
- `page`: pagination
- `limit`: records per section

**Example Request:**
```
GET /api/dashboard?dateRange=month&page=1&limit=100
```

**Implementation:**
```javascript
exports.getDashboard = async (req, res) => {
  try {
    const { dateRange = 'all', page = 1, limit = 100 } = req.query;
    
    // Calculate date range
    let dateFilter = '';
    const now = new Date();
    switch(dateRange) {
      case 'today':
        dateFilter = `DATE(created_at) = CURDATE()`;
        break;
      case 'week':
        dateFilter = `created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
        break;
      case 'month':
        dateFilter = `created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
        break;
      case 'year':
        dateFilter = `created_at >= DATE_SUB(NOW(), INTERVAL 365 DAY)`;
        break;
      default:
        dateFilter = '1=1';
    }
    
    // Fetch KPIs
    const kpis = await db.query(`
      SELECT 
        COUNT(DISTINCT id) as total_customers,
        (SELECT COUNT(*) FROM loan_customers WHERE ${dateFilter}) as total_loans,
        (SELECT COUNT(*) FROM loan_customers WHERE status_approved = 'ACTIVE' AND ${dateFilter}) as active_loans,
        (SELECT SUM(loan_amount) FROM loan_customers WHERE ${dateFilter}) as total_issued,
        (SELECT SUM(remaining_balance) FROM loan_customers WHERE ${dateFilter}) as outstanding
      FROM customers
    `);
    
    // Fetch recent payments
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 100));
    const offset = (pageNum - 1) * pageSize;
    
    const recentPayments = await db.query(`
      SELECT * FROM payments 
      WHERE ${dateFilter}
      ORDER BY payment_date DESC
      LIMIT ? OFFSET ?
    `, [pageSize, offset]);
    
    // Fetch overdue loans
    const overdueLoans = await db.query(`
      SELECT * FROM loan_customers 
      WHERE next_payment_due < CURDATE() AND ${dateFilter}
      LIMIT 50
    `);
    
    // ... other dashboard data
    
    res.json({
      kpis: kpis[0],
      recentPayments,
      overdueLoans,
      loanStatusBreakdown: [],
      monthlyTrend: []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
```

---

## Reports Endpoints

### GET `/api/reports/summary`

**Query Parameters:**
- `dateFrom`: Start date (YYYY-MM-DD)
- `dateTo`: End date (YYYY-MM-DD)
- `sortBy`: Field to sort by
- `sortOrder`: asc, desc
- `page`: pagination
- `limit`: records per page

---

### GET `/api/reports/payments`
### GET `/api/reports/overdue`
### GET `/api/reports/customers`

All reports endpoints should accept the same query parameters.

---

## Security Considerations

1. **SQL Injection Prevention**: Use parameterized queries (prepared statements)
2. **Column Name Validation**: Whitelist allowed column names for sorting
3. **Limit Boundaries**: Enforce min/max values for page and limit
4. **Authentication**: Ensure user is authenticated before accessing data
5. **Authorization**: Verify user has permission to access the requested data

**Example Column Whitelist:**
```javascript
const ALLOWED_SORT_FIELDS = {
  customers: ['firstName', 'lastName', 'email', 'phoneNumber', 'profileStatus', 'createdAt'],
  loans: ['applicationDate', 'loanAmount', 'interestRate', 'statusApproved'],
  payments: ['paymentDate', 'amountPaid', 'paymentMethod'],
  reports: ['date', 'amount', 'status']
};

function sanitizeColumnName(table, column) {
  if (!ALLOWED_SORT_FIELDS[table]?.includes(column)) {
    return 'createdAt'; // Default fallback
  }
  return column;
}
```

---

## Testing

Test the endpoints with curl:

```bash
# GET customers with filters
curl "http://localhost:5000/api/customers?search=john&sortBy=firstName&sortOrder=asc&page=1&limit=50"

# GET loans with status filter
curl "http://localhost:5000/api/loan_customers?loanStatus=ACTIVE&sortBy=applicationDate&sortOrder=desc&limit=25"

# GET payments with method filter
curl "http://localhost:5000/api/payments?paymentMethod=CASH&page=1&limit=100"

# GET dashboard with date range
curl "http://localhost:5000/api/dashboard?dateRange=month&limit=100"

# GET reports
curl "http://localhost:5000/api/reports/summary?dateFrom=2024-01-01&dateTo=2024-12-31"
```

---

## Implementation Checklist

- [ ] Update `customerController.getAllCustomers()` to handle query params
- [ ] Update `loanController.getAllLoanCustomers()` to handle query params
- [ ] Update `paymentController.getAllPayments()` to handle query params
- [ ] Update `reportController.*` endpoints to handle query params
- [ ] Update `dashboardController.getDashboard()` to handle date range param
- [ ] Add input validation middleware for query parameters
- [ ] Add column name whitelisting for sort fields
- [ ] Test all endpoints with various parameter combinations
- [ ] Update API documentation with examples
- [ ] Monitor performance with pagination
