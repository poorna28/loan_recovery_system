import React, { useState, useEffect } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";
import { toast } from "react-toastify";

const UserRole = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive

  // Fetch users and roles on component mount
  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      // Fetch users and roles in parallel
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/users'),
        api.get('/roles')
      ]);

      console.log("Users response:", usersRes.data);
      console.log("Roles response:", rolesRes.data);

      // Format users data
      const usersData = (usersRes.data.users || usersRes.data.data || []).map(user => {
        // Get color for role badge
        const roleColor = getRoleColor(user.role_name);
        return {
          id: user.id || user.user_id,
          initial: (user.name || user.email || 'U')[0].toUpperCase(),
          name: user.name || 'Unknown',
          email: user.email || '',
          role: user.role_name || 'User',
          roleColor: roleColor.color,
          roleBg: roleColor.bg,
          active: user.is_active !== 0 && user.is_active !== false,
          created_at: user.created_at,
        };
      });

      setUsers(usersData);
      setRoles(rolesRes.data.roles || rolesRes.data.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch users/roles:', err);
      setError('Failed to load users and roles. Please try again.');
      toast.error('Failed to load users and roles');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (roleName) => {
    const roleColors = {
      'Super Admin': { color: '#5080ff', bg: 'rgba(80,128,255,0.12)' },
      'Admin': { color: '#5080ff', bg: 'rgba(80,128,255,0.12)' },
      'Manager': { color: '#1cd988', bg: 'rgba(28,217,136,0.10)' },
      'Agent': { color: '#f5a623', bg: 'rgba(245,166,35,0.10)' },
      'User': { color: '#667085', bg: 'rgba(102,112,133,0.10)' },
    };
    return roleColors[roleName] || { color: '#667085', bg: 'rgba(102,112,133,0.10)' };
  };

  const addUser = () => {
    toast.info('Add User modal coming soon');
    // TODO: Open modal to add new user
  };

  const editUser = async (user) => {
    toast.info(`Edit ${user.name} - Coming soon`);
    // TODO: Open modal to edit user with pre-filled data
  };

  const deleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(u => u.id !== userId));
        setSuccess(`${userName} deleted successfully`);
        toast.success(`${userName} deleted successfully`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Failed to delete user:', err);
        setError('Failed to delete user');
        toast.error('Failed to delete user');
      }
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const newStatus = !user.active;
      await api.put(`/users/${user.id}`, {
        is_active: newStatus
      });
      
      const updatedUsers = users.map(u =>
        u.id === user.id ? { ...u, active: newStatus } : u
      );
      setUsers(updatedUsers);
      setSuccess(`${user.name} ${newStatus ? 'activated' : 'deactivated'} successfully`);
      toast.success(`${user.name} ${newStatus ? 'activated' : 'deactivated'}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status');
      toast.error('Failed to update user status');
    }
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'active' && user.active) ||
                          (filterStatus === 'inactive' && !user.active);
    return matchesSearch && matchesStatus;
  });

  const activeCount = users.filter(u => u.active).length;
  return (
    <Layout>
      <div className="settings">
        <div className="panel" id="panel-users">
          <div className="page-top">
            <div>
              <div className="page-title">Users & Roles</div>
              <div className="page-sub">Manage staff access and permissions</div>
            </div>
            <button
              className="btn btn-primary"
              style={{ fontSize: "11px" }}
              onClick={addUser}
            >
              + Add User
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success!</strong> {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {/* Search and Filter Section */}
          <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="section">
            <div className="section-head">
              <div className="section-icon" style={{ background: "var(--blue-dim)" }}>👥</div>
              <div>
                <div className="section-title">Staff Members</div>
                <div className="section-desc">
                  {loading ? '⏳ Loading...' : `${activeCount} active, ${users.length} total`}
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted2)' }}>
                ⏳ Loading users and roles...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted2)' }}>
                {searchTerm || filterStatus !== 'all'
                  ? '❌ No users match your filters'
                  : '❌ No users found'}
              </div>
            ) : (
              <div id="user-list">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "14px 22px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg,var(--blue),var(--violet))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-h)",
                        fontSize: "14px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {user.initial}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--muted2)" }}>{user.email}</div>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "3px 9px",
                        borderRadius: "20px",
                        background: user.roleBg,
                        color: user.roleColor,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {user.role}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "10px",
                        color: user.active ? "var(--green)" : "var(--muted2)",
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleUserStatus(user)}
                      title="Click to toggle status"
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: user.active ? "var(--green)" : "var(--muted)",
                        }}
                      ></div>
                      {user.active ? "Active" : "Inactive"}
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: "10px", padding: "5px 12px" }}
                      onClick={() => editUser(user)}
                      title="Edit user"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: "10px", padding: "5px 12px", color: 'var(--red)' }}
                      onClick={() => deleteUser(user.id, user.name)}
                      title="Delete user"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserRole;