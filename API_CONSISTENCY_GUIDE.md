# API Consistency Updates - Documentation

## Overview
All APIs in the application have been updated to include consistent payload passing and state parameters in URLs. This ensures better data validation, filtering, and API consistency.

## Query Builder Utility (`/client/src/utils/queryBuilder.js`)

### Functions:

#### 1. `buildQueryString(filters)`
Builds URL query parameters from a filter object.

**Parameters:**
- `search` - Search term for filtering
- `sortBy` - Field name to sort by
- `sortOrder` - 'asc' or 'desc'
- `page` - Page number (1-indexed)
- `limit` - Records per page
- `status`, `profileStatus`, `employmentStatus` - Status filters
- `loanStatus`, `paymentMethod` - Entity-specific filters
- `dateFrom`, `dateTo` - Date range filters

**Example:**
```javascript
const queryString = buildQueryString({
  search: 'john',
  sortBy: 'firstName',
  sortOrder: 'asc',
  page: 1,
  limit: 50,
  profileStatus: 'Active'
});
// Returns: "search=john&sortBy=firstName&sortOrder=asc&page=1&limit=50&profileStatus=Active"
```

#### 2. `buildUrl(baseUrl, filters)`
Builds complete URL with query parameters.

**Example:**
```javascript
const url = buildUrl('customers', {
  search: 'john',
  page: 1,
  limit: 50
});
// Returns: "customers?search=john&page=1&limit=50"

// Then use with API
const res = await api.get(url);
```

#### 3. `buildPayload(data, options)`
Builds consistent payload for POST/PUT requests.

**Parameters:**
- `data` - Form data object
- `options.excludeFields` - Array of field names to exclude
- `options.includeFields` - Array of field names to include (if set, only these are included)
- `options.transformFields` - Object mapping old keys to new keys for renaming

**Example:**
```javascript
const payload = buildPayload(
  {
    firstName: 'John',
    lastName: 'Doe',
    customer_id: 123,
    phoneNumber: '9999999999'
  },
  { 
    excludeFields: ['customer_id'],
    transformFields: {}
  }
);
// Returns: { firstName: 'John', lastName: 'Doe', phoneNumber: '9999999999' }
```

## Updated API Calls

### Customer List Page (`/client/src/pages/Customers/customer_list.js`)

**Before:**
```javascript
const res = await api.get('customers');
```

**After:**
```javascript
const [filters, setFilters] = useState({
  search: '',
  sortBy: 'firstName',
  sortOrder: 'asc',
  page: 1,
  limit: 50,
  profileStatus: '',
  employmentStatus: ''
});

const url = buildUrl('customers', filters);
const res = await api.get(url);
```

**URL Example:**
`GET /api/customers?search=&sortBy=firstName&sortOrder=asc&page=1&limit=50&profileStatus=&employmentStatus=`

---

### Loan List Page (`/client/src/pages/Loans/loan_list.js`)

**Before:**
```javascript
api.get('loan_customers')
```

**After:**
```javascript
const [filters, setFilters] = useState({
  search: '',
  sortBy: 'applicationDate',
  sortOrder: 'desc',
  page: 1,
  limit: 50,
  loanStatus: ''
});

const url = buildUrl('loan_customers', filters);
api.get(url)
```

**URL Example:**
`GET /api/loan_customers?search=&sortBy=applicationDate&sortOrder=desc&page=1&limit=50&loanStatus=`

---

### Payment Page (`/client/src/pages/Payments/payment_page.js`)

**Before:**
```javascript
api.get('payments')
```

**After:**
```javascript
const [filters, setFilters] = useState({
  search: '',
  sortBy: 'paymentDate',
  sortOrder: 'desc',
  page: 1,
  limit: 50,
  paymentMethod: ''
});

const url = buildUrl('payments', filters);
api.get(url)
```

**URL Example:**
`GET /api/payments?search=&sortBy=paymentDate&sortOrder=desc&page=1&limit=50&paymentMethod=`

---

### Dashboard Page (`/client/src/pages/Dashboard/Dashboard.js`)

**Before:**
```javascript
const res = await api.get('/dashboard');
```

**After:**
```javascript
const [dashboardParams, setDashboardParams] = useState({
  dateRange: 'all',
  limit: 100,
  page: 1
});

const url = buildUrl('/dashboard', dashboardParams);
const res = await api.get(url);
```

**URL Example:**
`GET /api/dashboard?dateRange=all&limit=100&page=1`

---

### Reports Page (`/client/src/pages/Reports/reports-list.js`)

**Before:**
```javascript
const res = await api.get(tab.endpoint); // e.g., '/reports/summary'
```

**After:**
```javascript
const [reportFilters, setReportFilters] = useState({
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 100
});

const url = buildUrl(tab.endpoint, reportFilters);
const res = await api.get(url);
```

**URL Example:**
`GET /api/reports/summary?dateFrom=&dateTo=&sortBy=date&sortOrder=desc&page=1&limit=100`

---

### Payment Form (`/client/src/pages/Payments/payment_form.js`)

**Before:**
```javascript
const response = await api.post('/payments/make', {
  loanId: Number(formData.loanId),
  amount: Number(formData.amount),
  method: formData.method
});
```

**After:**
```javascript
const payload = buildPayload(
  {
    loanId: Number(formData.loanId),
    amount: Number(formData.amount),
    paymentMethod: formData.method,
    timestamp: new Date().toISOString()
  },
  { excludeFields: [] }
);

const response = await api.post('/payments/make', payload);
```

**Payload Example:**
```json
{
  "loanId": 123,
  "amount": 5000,
  "paymentMethod": "CASH",
  "timestamp": "2024-04-14T10:30:00.000Z"
}
```

---

### Loan Form (`/client/src/pages/Loans/loan_list_details.js`)

**Before:**
```javascript
const payload = {
  customer_id: formData.customer_id,
  loan_amount: formData.loanAmount,
  loan_purpose: formData.loanPurpose,
  // ... other fields
};

api.post("/loan_customers", payload);
```

**After:**
```javascript
const payload = buildPayload(
  {
    customer_id: formData.customer_id,
    loan_amount: formData.loanAmount,
    loan_purpose: formData.loanPurpose,
    // ... other fields
  },
  { excludeFields: [] }
);

api.post("/loan_customers", payload);
```

---

### Customer Form (`/client/src/pages/Customers/customer_details.js`)

**Before:**
```javascript
const formPayload = new FormData();
Object.entries(sanitizedFormData).forEach(([key, value]) => {
  if ((key === 'customer_id' || key === 'id') && !editData) return;
  if (value !== null && value !== undefined) {
    formPayload.append(key, value);
  }
});

api.post('/customers', formPayload);
```

**After:**
```javascript
const cleanPayload = buildPayload(
  sanitizedFormData,
  {
    excludeFields: editData ? [] : ['customer_id', 'id'],
    transformFields: {}
  }
);

const formPayload = new FormData();
Object.entries(cleanPayload).forEach(([key, value]) => {
  if (value !== null && value !== undefined) {
    formPayload.append(key, value);
  }
});

api.post('/customers', formPayload);
```

---

## Benefits

1. **Consistency**: All API calls follow the same pattern with query parameters and payloads
2. **Filtering**: Query parameters allow backend to implement server-side filtering
3. **Pagination**: Page and limit parameters enable pagination
4. **Sorting**: sortBy and sortOrder parameters enable sorting
5. **Maintainability**: Centralized query builder utility makes changes easier
6. **Validation**: buildPayload function removes null/undefined values automatically

## Backend Expectations

The backend routes should now accept query parameters. Example implementation in Express:

```javascript
// GET /api/customers
router.get('/customers', (req, res) => {
  const { search, sortBy, sortOrder, page, limit, profileStatus, employmentStatus } = req.query;
  
  // Use these parameters to filter and sort results
  // search: filter by name/email/phone
  // sortBy: field to sort by (firstName, email, etc.)
  // sortOrder: 'asc' or 'desc'
  // page: pagination page number
  // limit: records per page
  // profileStatus: filter by status
  // employmentStatus: filter by employment
  
  // Return filtered/sorted results
});
```

---

## Migration Checklist

- [x] Create query builder utility
- [x] Update customer_list.js with filters
- [x] Update loan_list.js with filters
- [x] Update payment_page.js with filters
- [x] Update reports-list.js with filters
- [x] Update Dashboard.js with params
- [x] Update customer_details.js with buildPayload
- [x] Update loan_list_details.js with buildPayload
- [x] Update payment_form.js with buildPayload
- [ ] Update backend routes to handle query parameters
- [ ] Add UI controls for filtering/sorting
- [ ] Test all API calls end-to-end
