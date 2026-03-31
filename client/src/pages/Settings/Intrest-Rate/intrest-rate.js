import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";


const IntrestRate = () => {
  const [defaultRate, setDefaultRate] = useState(18);
  const [personalRate, setPersonalRate] = useState(18);
  const [businessRate, setBusinessRate] = useState(14);
  const [goldRate, setGoldRate] = useState(12);

  const markDirty = () => console.log("Form changed");
  const saveSettings = () => console.log("Saving interest rates...");
  const discardChanges = () => console.log("Resetting interest rates...");

  // Derived values
  const monthlyRate = (defaultRate / 12).toFixed(2);
  const dailyRate = (defaultRate / 365).toFixed(3);
    return (
        <Layout>
            <div className="settings">
                 <div className="panel active" id="panel-interest">
        <div className="page-top">
          <div>
            <div className="page-title">Interest Rates</div>
            <div className="page-sub">
              Configure default and per-type interest rates · GET /api/settings/interest-rates
            </div>
          </div>
          <span className="status-badge badge-live">● Live</span>
        </div>

        {/* Default Interest Rate */}
        <div className="section">
          <div className="section-head">
            <div className="section-icon" style={{ background: "var(--blue-dim)" }}>📊</div>
            <div>
              <div className="section-title">Default Interest Rate</div>
              <div className="section-desc">Applied when no specific rate is set for loan type</div>
            </div>
          </div>
          <div className="section-body">
            <div className="form-grid" style={{ alignItems: "start" }}>
              <div className="field">
                <label className="field-label">Annual Interest Rate (%)</label>
                <div className="input-wrap">
                  <input
                    className="input"
                    type="number"
                    value={defaultRate}
                    step="0.5"
                    min="1"
                    max="48"
                    onChange={(e) => { setDefaultRate(parseFloat(e.target.value)); markDirty(); }}
                  />
                  <span className="input-suffix">%/yr</span>
                </div>
                <div className="field-hint" style={{ marginTop: "8px" }}>
                  <div className="slider-row">
                    <input
                      className="slider-input"
                      type="range"
                      min="1"
                      max="48"
                      value={defaultRate}
                      step="0.5"
                      onChange={(e) => { setDefaultRate(parseFloat(e.target.value)); markDirty(); }}
                    />
                    <span className="slider-val">{defaultRate}%</span>
                  </div>
                </div>
              </div>
              <div className="rate-visual">
                <div className="rate-circle">
                  <div>
                    <div className="rate-circle-val">{defaultRate}</div>
                    <div className="rate-circle-unit">% / yr</div>
                  </div>
                </div>
                <div>
                  <div className="rate-info-label">Monthly Rate</div>
                  <div className="rate-info-val">{monthlyRate}% / mo</div>
                  <div className="rate-info-label" style={{ marginTop: "10px" }}>Daily Rate</div>
                  <div className="rate-info-val">{dailyRate}% / day</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate by Loan Type */}
        <div className="section">
          <div className="section-head">
            <div className="section-icon" style={{ background: "var(--green-dim)" }}>🏷️</div>
            <div>
              <div className="section-title">Rate by Loan Type</div>
              <div className="section-desc">Override default rate per loan category</div>
            </div>
          </div>
          <div className="section-body">
            <div className="form-grid cols-3">
              <div className="field">
                <label className="field-label">Personal Loan</label>
                <div className="input-wrap">
                  <input
                    className="input"
                    type="number"
                    value={personalRate}
                    step="0.5"
                    onChange={(e) => { setPersonalRate(parseFloat(e.target.value)); markDirty(); }}
                  />
                  <span className="input-suffix">%/yr</span>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Business Loan</label>
                <div className="input-wrap">
                  <input
                    className="input"
                    type="number"
                    value={businessRate}
                    step="0.5"
                    onChange={(e) => { setBusinessRate(parseFloat(e.target.value)); markDirty(); }}
                  />
                  <span className="input-suffix">%/yr</span>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Gold Loan</label>
                <div className="input-wrap">
                  <input
                    className="input"
                    type="number"
                    value={goldRate}
                    step="0.5"
                    onChange={(e) => { setGoldRate(parseFloat(e.target.value)); markDirty(); }}
                  />
                  <span className="input-suffix">%/yr</span>
                </div>
              </div>
            </div>
            <div style={{
              marginTop: "16px",
              padding: "12px 14px",
              background: "var(--amber-dim)",
              border: "1px solid rgba(245,166,35,0.2)",
              borderRadius: "var(--radius-sm)",
              fontSize: "11px",
              color: "var(--amber)"
            }}>
              ⚠ Changing rates applies to <strong>new loans only</strong>. Existing loans retain their original rate.
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="btn-row">
          <button className="btn btn-primary" onClick={saveSettings}>
            💾 Save Interest Rates
          </button>
          <button className="btn btn-ghost" onClick={discardChanges}>
            Reset
          </button>
        </div>
      </div>
            </div>

        </Layout>
    );

}

export default IntrestRate;

