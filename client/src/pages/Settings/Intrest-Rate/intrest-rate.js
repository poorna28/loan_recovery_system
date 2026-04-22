import React, { useState, useEffect } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";
import { toast } from "react-toastify";

const IntrestRate = () => {
  const [defaultRate, setDefaultRate] = useState(18);
  const [personalRate, setPersonalRate] = useState(18);
  const [businessRate, setBusinessRate] = useState(14);
  const [goldRate, setGoldRate] = useState(12);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch interest rates on mount
  useEffect(() => {
    fetchInterestRates();
  }, []);

  const fetchInterestRates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/interest-rates');
      if (response.data.success) {
        const settings = response.data.settings;
        setDefaultRate(settings.default_rate || 18);
        setPersonalRate(settings.personal_rate || 18);
        setBusinessRate(settings.business_rate || 14);
        setGoldRate(settings.gold_rate || 12);
      }
    } catch (error) {
      console.error('Error fetching interest rates:', error);
      toast.error(error.response?.data?.message || 'Failed to load interest rates');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const payload = {
        default_rate: parseFloat(defaultRate),
        personal_rate: parseFloat(personalRate),
        business_rate: parseFloat(businessRate),
        gold_rate: parseFloat(goldRate)
      };

      const response = await api.put('/settings/interest-rates', payload);
      
      if (response.data.success) {
        toast.success('Interest rates saved successfully');
      } else {
        toast.error(response.data.message || 'Failed to save rates');
      }
    } catch (error) {
      console.error('Error saving interest rates:', error);
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || 'Failed to save interest rates');
      }
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = async () => {
    await fetchInterestRates();
    toast.info('Changes discarded');
  };

  // Derived values
  const monthlyRate = (defaultRate / 12).toFixed(2);
  const dailyRate = (defaultRate / 365).toFixed(3);

  if (loading) {
    return (
      <Layout>
        <div className="settings">
          <div className="panel" id="panel-interest">
            <div style={{ padding: "40px", textAlign: "center" }}>
              Loading interest rates...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="settings">
        <div className="panel active" id="panel-interest">
          <div className="page-top">
            <div>
              <div className="page-title">Interest Rates</div>
              <div className="page-sub">
                Configure default and per-type interest rates
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
                      onChange={(e) => setDefaultRate(parseFloat(e.target.value))}
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
                        onChange={(e) => setDefaultRate(parseFloat(e.target.value))}
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
                      onChange={(e) => setPersonalRate(parseFloat(e.target.value))}
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
                      onChange={(e) => setBusinessRate(parseFloat(e.target.value))}
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
                      onChange={(e) => setGoldRate(parseFloat(e.target.value))}
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
            <button 
              className="btn btn-primary" 
              onClick={saveSettings}
              disabled={saving}
            >
              {saving ? "💾 Saving..." : "💾 Save Interest Rates"}
            </button>
            <button 
              className="btn btn-ghost" 
              onClick={discardChanges}
              disabled={saving}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

    </Layout>
  );

}

export default IntrestRate;
