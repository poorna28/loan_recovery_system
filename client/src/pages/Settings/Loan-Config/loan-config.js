import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";

const LoanConfig = () => {
  // State for Loan Term Limits
  const [minTenure, setMinTenure] = useState(3);
  const [maxTenure, setMaxTenure] = useState(60);
  const [defaultTenure, setDefaultTenure] = useState(12);

  // State for Loan Amount Limits
  const [minAmount, setMinAmount] = useState(5000);
  const [maxAmount, setMaxAmount] = useState(1000000);
  const [emiMethod, setEmiMethod] = useState("Reducing Balance");

  // State for Penalty Rules
  const [lateFee, setLateFee] = useState(200);
  const [penaltyRate, setPenaltyRate] = useState(2);
  const [gracePeriod, setGracePeriod] = useState(3);

  const markDirty = () => console.log("Form changed");
  const saveSettings = () => console.log("Saving loan config...");
  const discardChanges = () => console.log("Resetting to defaults...");
  const handleTagInput = (e) => {
    if (e.key === "Enter") {
      console.log("Add loan type:", e.target.value);
      e.target.value = "";
    }
  };

  return (
    <Layout>
      <div className="settings">
        <div className="panel active" id="panel-loan">
          <div className="page-top">
            <div>
              <div className="page-title">Loan Configuration</div>
              <div className="page-sub">
                Define default terms, limits, and loan types · GET /api/settings/loan-config
              </div>
            </div>
            <span className="status-badge badge-live">● Live</span>
          </div>

          {/* Loan Term Limits */}
          <div className="section">
            <div className="section-head">
              <div className="section-icon" style={{ background: "var(--blue-dim)" }}>📐</div>
              <div>
                <div className="section-title">Loan Term Limits</div>
                <div className="section-desc">Min / max duration allowed for any loan</div>
              </div>
            </div>
            <div className="section-body">
              <div className="form-grid cols-3">
                <div className="field">
                  <label className="field-label">Minimum Tenure</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={minTenure}
                      min="1"
                      onChange={(e) => { setMinTenure(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">mo</span>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Maximum Tenure</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={maxTenure}
                      min="1"
                      onChange={(e) => { setMaxTenure(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">mo</span>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Default Tenure</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={defaultTenure}
                      min="1"
                      onChange={(e) => { setDefaultTenure(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">mo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Amount Limits */}
          <div className="section">
            <div className="section-head">
              <div className="section-icon" style={{ background: "var(--violet-dim)" }}>💵</div>
              <div>
                <div className="section-title">Loan Amount Limits</div>
                <div className="section-desc">Min / max principal allowed per loan</div>
              </div>
            </div>
            <div className="section-body">
              <div className="form-grid">
                <div className="field">
                  <label className="field-label">Minimum Loan Amount</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={minAmount}
                      onChange={(e) => { setMinAmount(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Maximum Loan Amount</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={maxAmount}
                      onChange={(e) => { setMaxAmount(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">EMI Calculation Method</label>
                  <select
                    className="input"
                    value={emiMethod}
                    onChange={(e) => { setEmiMethod(e.target.value); markDirty(); }}
                  >
                    <option>Reducing Balance</option>
                    <option>Flat Rate</option>
                    <option>Compound Interest</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Loan Types Offered</label>
                  <div className="tag-input-wrap" id="loan-types-wrap">
                    <input
                      className="tag-ghost-input"
                      id="tag-input"
                      placeholder="Add type…"
                      onKeyDown={handleTagInput}
                    />
                  </div>
                  <div className="field-hint">Press Enter to add a type</div>
                </div>
              </div>
            </div>
          </div>

          {/* Penalty Rules */}
          <div className="section">
            <div className="section-head">
              <div className="section-icon" style={{ background: "var(--amber-dim)" }}>⚖️</div>
              <div>
                <div className="section-title">Penalty Rules</div>
                <div className="section-desc">Fees charged on overdue EMIs</div>
              </div>
            </div>
            <div className="section-body">
              <div className="form-grid cols-3">
                <div className="field">
                  <label className="field-label">Late Fee (flat)</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={lateFee}
                      onChange={(e) => { setLateFee(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Penalty Rate</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={penaltyRate}
                      step="0.1"
                      onChange={(e) => { setPenaltyRate(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">%/mo</span>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Grace Period</label>
                  <div className="input-wrap">
                    <input
                      className="input"
                      type="number"
                      value={gracePeriod}
                      onChange={(e) => { setGracePeriod(e.target.value); markDirty(); }}
                    />
                    <span className="input-suffix">days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="btn-row">
            <button className="btn btn-primary" onClick={saveSettings}>
              💾 Save Loan Config
            </button>
            <button className="btn btn-ghost" onClick={discardChanges}>
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanConfig;
