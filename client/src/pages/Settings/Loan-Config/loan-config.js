import React, { useState, useEffect, useCallback } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchLoanConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/loan-config');
      if (response.data.success) {
        const config = response.data.settings;
        setMinTenure(config.min_tenure || 3);
        setMaxTenure(config.max_tenure || 60);
        setDefaultTenure(config.default_tenure || 12);
        setMinAmount(config.min_amount || 5000);
        setMaxAmount(config.max_amount || 1000000);
        setEmiMethod(config.emi_method || "Reducing Balance");
        setLateFee(config.late_fee || 200);
        setPenaltyRate(config.penalty_rate || 2);
        setGracePeriod(config.grace_period || 3);
      }
    } catch (error) {
      console.error('Error fetching loan config:', error);
      toast.error(error.response?.data?.message || 'Failed to load loan configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch loan config on mount
  useEffect(() => {
    fetchLoanConfig();
  }, [fetchLoanConfig]);

  const saveSettings = async () => {
    try {
      setSaving(true);
      const payload = {
        min_tenure: parseInt(minTenure),
        max_tenure: parseInt(maxTenure),
        default_tenure: parseInt(defaultTenure),
        min_amount: parseFloat(minAmount),
        max_amount: parseFloat(maxAmount),
        emi_method: emiMethod,
        late_fee: parseFloat(lateFee),
        penalty_rate: parseFloat(penaltyRate),
        grace_period: parseInt(gracePeriod)
      };

      const response = await api.put('/settings/loan-config', payload);

      if (response.data.success) {
        toast.success('Loan configuration saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving loan config:', error);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || 'Failed to save loan configuration');
      }
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = async () => {
    await fetchLoanConfig();
    toast.info('Changes discarded');
  };

  // const handleTagInput = (e) => {
  //   if (e.key === "Enter") {
  //     console.log("Add loan type:", e.target.value);
  //     e.target.value = "";
  //   }
  // };

  if (loading) {
    return (
      <Layout>
        <div className="settings">
          <div className="panel" id="panel-loan">
            <div style={{ padding: "40px", textAlign: "center" }}>
              Loading loan configuration...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="settings">
        <div className="panel active" id="panel-loan">
          <div className="page-top">
            <div>
              <div className="page-title">Loan Configuration</div>
              <div className="page-sub">
                Define default terms, limits, and loan types
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
                      onChange={(e) => setMinTenure(e.target.value)}
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
                      onChange={(e) => setMaxTenure(e.target.value)}
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
                      onChange={(e) => setDefaultTenure(e.target.value)}
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
                      onChange={(e) => setMinAmount(e.target.value)}
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
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                    <span className="input-suffix">₹</span>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">EMI Calculation Method</label>
                  <select
                    className="input"
                    value={emiMethod}
                    onChange={(e) => setEmiMethod(e.target.value)}
                  >
                    <option>Reducing Balance</option>
                    <option>Flat Rate</option>
                    <option>Simple Interest</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Loan Types Offered</label>
                  <select id="loan-types-dropdown" className="input">
                    <option value="">Select Loan Type</option>
                    <option value="Educational">Educational</option>
                    <option value="Home">Home</option>
                    <option value="Gold">Gold</option>
                    <option value="Personal">Personal</option>
                    {/* Add more from config */}
                  </select>
                  <div className="field-hint">Choose from available loan types</div>
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
                      onChange={(e) => setLateFee(e.target.value)}
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
                      onChange={(e) => setPenaltyRate(e.target.value)}
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
                      onChange={(e) => setGracePeriod(e.target.value)}
                    />
                    <span className="input-suffix">days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={saveSettings}
              disabled={saving}
            >
              {saving ? "💾 Saving..." : "💾 Save Loan Config"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={discardChanges}
              disabled={saving}
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanConfig;
