# Settings Frontend Implementation Guide (Remaining Pages)

This guide shows how to update the remaining 3 Settings frontend pages (Notifications, Users & Roles, and Danger Zone) to integrate with the backend API.

## Pattern for All Pages

Each page should follow this pattern:

```javascript
import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/settings/endpoint');
      if (response.data.success) {
        setData(response.data.settings);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await api.put('/api/settings/endpoint', data);
      if (response.data.success) {
        toast.success('Saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Layout><div style={{ padding: "40px", textAlign: "center" }}>Loading...</div></Layout>;
  }

  return <Layout>{/* JSX */}</Layout>;
};

export default SettingsPage;
```

---

## 1. Notifications Page (`notifications.js`)

**File Location:** `/client/src/pages/Settings/Notifications/notifications.js`

**API Endpoint:** `/api/settings/notifications`

**State Variables to Add:**

```javascript
const [paymentConfirmation, setPaymentConfirmation] = useState(true);
const [emiReminder, setEmiReminder] = useState(true);
const [overdueAlert, setOverdueAlert] = useState(true);
const [loanClosure, setLoanClosure] = useState(true);
const [smsProvider, setSmsProvider] = useState("Twilio");
const [smsSenderId, setSmsSenderId] = useState("LOANPRO");
const [smtpHost, setSmtpHost] = useState("");
const [smtpPort, setSmtpPort] = useState(587);
const [smtpUsername, setSmtpUsername] = useState("");
const [smtpPassword, setSmtpPassword] = useState("");
const [smtpFrom, setSmtpFrom] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
```

**Fetch Function:**

```javascript
const fetchNotifications = async () => {
  try {
    setLoading(true);
    const response = await api.get('/api/settings/notifications');
    if (response.data.success) {
      const settings = response.data.settings;
      setPaymentConfirmation(settings.payment_confirmation || true);
      setEmiReminder(settings.emi_reminder || true);
      setOverdueAlert(settings.overdue_alert || true);
      setLoanClosure(settings.loan_closure || true);
      setSmsProvider(settings.sms_provider || "Twilio");
      setSmsSenderId(settings.sms_sender_id || "LOANPRO");
      setSmtpHost(settings.smtp_host || "");
      setSmtpPort(settings.smtp_port || 587);
      setSmtpUsername(settings.smtp_username || "");
      setSmtpPassword(settings.smtp_password || "");
      setSmtpFrom(settings.smtp_from || "");
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Failed to load notifications');
  } finally {
    setLoading(false);
  }
};
```

**Save Function:**

```javascript
const saveSettings = async () => {
  try {
    setSaving(true);
    const payload = {
      payment_confirmation: paymentConfirmation,
      emi_reminder: emiReminder,
      overdue_alert: overdueAlert,
      loan_closure: loanClosure,
      sms_provider: smsProvider,
      sms_sender_id: smsSenderId,
      smtp_host: smtpHost,
      smtp_port: parseInt(smtpPort),
      smtp_username: smtpUsername,
      smtp_password: smtpPassword,
      smtp_from: smtpFrom
    };

    const response = await api.put('/api/settings/notifications', payload);
    if (response.data.success) {
      toast.success('Notification settings saved successfully');
    } else {
      toast.error(response.data.message || 'Failed to save');
    }
  } catch (error) {
    console.error('Error:', error);
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach(err => toast.error(err));
    } else {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  } finally {
    setSaving(false);
  }
};
```

---

## 2. Users & Roles Page (`user-role.js`)

**File Location:** `/client/src/pages/Settings/Users-Roles/user-role.js`

**API Endpoints:**
- GET `/api/settings/users?page=1&limit=10`
- GET `/api/settings/users/:userId/roles`
- PUT `/api/settings/users/:userId/roles`
- DELETE `/api/settings/users/:userId`
- GET `/api/settings/roles`

**State Variables to Add:**

```javascript
const [users, setUsers] = useState([]);
const [roles, setRoles] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [selectedRoles, setSelectedRoles] = useState([]);
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
const [total, setTotal] = useState(0);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
```

**Fetch Functions:**

```javascript
const fetchUsers = async (pageNum = 1, searchTerm = "") => {
  try {
    setLoading(true);
    const response = await api.get(`/api/settings/users?page=${pageNum}&limit=${limit}&search=${searchTerm}`);
    if (response.data.success) {
      setUsers(response.data.data.users || []);
      setTotal(response.data.data.pagination.total);
      setPage(pageNum);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Failed to load users');
  } finally {
    setLoading(false);
  }
};

const fetchRoles = async () => {
  try {
    const response = await api.get('/api/settings/roles');
    if (response.data.success) {
      setRoles(response.data.data || []);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Failed to load roles');
  }
};

const fetchUserRoles = async (userId) => {
  try {
    const response = await api.get(`/api/settings/users/${userId}/roles`);
    if (response.data.success) {
      setSelectedRoles(response.data.data.map(r => r.id) || []);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Failed to load user roles');
  }
};
```

**Update User Roles:**

```javascript
const updateUserRoles = async (userId) => {
  try {
    setSaving(true);
    const response = await api.put(`/api/settings/users/${userId}/roles`, {
      roleIds: selectedRoles
    });
    if (response.data.success) {
      toast.success('User roles updated successfully');
      fetchUsers(page, search); // Refresh users list
    } else {
      toast.error(response.data.message || 'Failed to update roles');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Failed to update roles');
  } finally {
    setSaving(false);
  }
};
```

**Delete User:**

```javascript
const deleteUser = async (userId) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    try {
      setSaving(true);
      const response = await api.delete(`/api/settings/users/${userId}`);
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers(page, search); // Refresh users list
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  }
};
```

---

## 3. Danger Zone Page (`danger-zone.js`)

**File Location:** `/client/src/pages/Settings/Danger-Zone/danger-zone.js`

**API Endpoints:**
- POST `/api/settings/reset` - Reset all settings
- GET `/api/settings/audit-log?settingType=&days=30` - Get audit logs

**State Variables to Add:**

```javascript
const [auditLog, setAuditLog] = useState([]);
const [resetting, setResetting] = useState(false);
const [loading, setLoading] = useState(false);
```

**Fetch Audit Log:**

```javascript
const fetchAuditLog = async () => {
  try {
    setLoading(true);
    const response = await api.get('/api/settings/audit-log?days=30');
    if (response.data.success) {
      setAuditLog(response.data.data || []);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Failed to load audit log');
  } finally {
    setLoading(false);
  }
};
```

**Reset Settings Function:**

```javascript
const handleReset = async () => {
  const confirmed = window.confirm(
    'Are you absolutely sure? This will reset ALL settings to default values. This action cannot be undone.'
  );
  
  if (!confirmed) return;

  try {
    setResetting(true);
    const response = await api.post('/api/settings/reset');
    if (response.data.success) {
      toast.success('Settings reset to defaults successfully');
      // Optionally reload page or navigate
      window.location.reload();
    } else {
      toast.error(response.data.message || 'Failed to reset settings');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.response?.data?.message || 'Failed to reset settings');
  } finally {
    setResetting(false);
  }
};
```

---

## Implementation Checklist for Remaining Pages

For each of the remaining 3 pages, ensure:

- [ ] Import statements added (React, useState, useEffect, Layout, api, toast)
- [ ] All required state variables initialized
- [ ] useEffect hook added to fetch data on mount
- [ ] Fetch function(s) implemented with proper error handling
- [ ] Save/update function(s) implemented with API calls
- [ ] Loading state showing while fetching
- [ ] Saving state disabling buttons while processing
- [ ] Toast notifications for success/error messages
- [ ] Validation error messages displayed
- [ ] Buttons disabled during API calls
- [ ] Confirmation dialogs for destructive operations (delete, reset)
- [ ] Proper error handling with try/catch blocks

---

## Common Patterns

### Error Handling Pattern
```javascript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  if (error.response?.data?.errors) {
    error.response.data.errors.forEach(err => toast.error(err));
  } else {
    toast.error(error.response?.data?.message || 'Operation failed');
  }
} finally {
  setSaving(false);
}
```

### Loading Pattern
```javascript
if (loading) {
  return (
    <Layout>
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading...
      </div>
    </Layout>
  );
}
```

### Button Disabled State
```javascript
<button 
  className="btn btn-primary" 
  onClick={saveSettings}
  disabled={saving}
>
  {saving ? "💾 Saving..." : "💾 Save Settings"}
</button>
```

---

## API Response Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation completed",
  "settings": { /* data */ },
  "data": { /* optional list data */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Field error 1", "Field error 2"]
}
```

Always check `response.data.success` before using the returned data.

---

## Notes

1. All API endpoints require authentication - JWT token is included automatically by the api.js service
2. Each page should display loading state while fetching initial data
3. Save buttons should be disabled during saving
4. Destructive operations (delete, reset) should have confirmation dialogs
5. Success/error messages should be displayed via toast notifications
6. Validation errors from the server should be displayed to the user
7. All field names use snake_case when calling the API, but camelCase in React state
8. Dates in responses are in ISO 8601 format with timezone info
