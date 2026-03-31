import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";

const UserRole = () => {

     const [users, setUsers] = useState([
    {
      initial: "A",
      name: "Admin User",
      email: "admin@loanpro.in",
      role: "Super Admin",
      roleColor: "#5080ff",
      roleBg: "rgba(80,128,255,0.12)",
      active: true,
    },
    {
      initial: "R",
      name: "Rajesh Kumar",
      email: "rajesh@loanpro.in",
      role: "Manager",
      roleColor: "#1cd988",
      roleBg: "rgba(28,217,136,0.10)",
      active: true,
    },
    {
      initial: "M",
      name: "Meena Joshi",
      email: "meena@loanpro.in",
      role: "Agent",
      roleColor: "#f5a623",
      roleBg: "rgba(245,166,35,0.10)",
      active: false,
    },
  ]);

  const addUser = () => {
    console.log("Add user clicked");
    // Add logic to open modal or form
  };

  const editUser = (user) => {
    console.log("Edit user:", user.name);
    // Add logic to edit user
  };
    return (
        <Layout>
            <div className="settings"> 
                   <div className="panel" id="panel-users">
        <div className="page-top">
          <div>
            <div className="page-title">Users &amp; Roles</div>
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

        <div className="section">
          <div className="section-head">
            <div className="section-icon" style={{ background: "var(--blue-dim)" }}>👥</div>
            <div>
              <div className="section-title">Staff Members</div>
              <div className="section-desc">{users.length} active users</div>
            </div>
          </div>

          <div id="user-list">
            {users.map((user, idx) => (
              <div
                key={idx}
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
                  }}
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
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
                </div>
         </Layout>
    )

}

export default UserRole;