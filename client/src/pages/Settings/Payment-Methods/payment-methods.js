import React, { useState, useEffect } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";
import { toast } from "react-toastify";

const PaymentMethods = () => {

    const [methods, setMethods] = useState([]);
    const [autoReceipt, setAutoReceipt] = useState(true);
    const [allowPartial, setAllowPartial] = useState(false);
    const [allowAdvance, setAllowAdvance] = useState(true);
    const [roundOff, setRoundOff] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch payment settings on mount
    useEffect(() => {
        fetchPaymentSettings();
    }, []);

    const fetchPaymentSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings/payment-methods');
            if (response.data.success) {
                const { methods: fetchedMethods, rules } = response.data.settings;
                setMethods(fetchedMethods || []);
                if (rules) {
                    setAutoReceipt(rules.auto_receipt || true);
                    setAllowPartial(rules.allow_partial || false);
                    setAllowAdvance(rules.allow_advance || true);
                    setRoundOff(rules.round_off || true);
                }
            }
        } catch (error) {
            console.error('Error fetching payment settings:', error);
            toast.error(error.response?.data?.message || 'Failed to load payment methods');
        } finally {
            setLoading(false);
        }
    };

    const toggleMethod = (methodId) => {
        setMethods(methods.map(m => 
            m.id === methodId ? { ...m, is_enabled: !m.is_enabled } : m
        ));
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            const payload = {
                methods: methods.map(m => ({ id: m.id, is_enabled: m.is_enabled })),
                rules: {
                    auto_receipt: autoReceipt,
                    allow_partial: allowPartial,
                    allow_advance: allowAdvance,
                    round_off: roundOff
                }
            };

            const response = await api.put('/settings/payment-methods', payload);
            
            if (response.data.success) {
                toast.success('Payment settings saved successfully');
            } else {
                toast.error(response.data.message || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving payment settings:', error);
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => toast.error(err));
            } else {
                toast.error(error.response?.data?.message || 'Failed to save payment settings');
            }
        } finally {
            setSaving(false);
        }
    };

    const discardChanges = async () => {
        await fetchPaymentSettings();
        toast.info('Changes discarded');
    };

    if (loading) {
        return (
            <Layout>
                <div className="settings">
                    <div className="panel" id="panel-payments">
                        <div style={{ padding: "40px", textAlign: "center" }}>
                            Loading payment settings...
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="settings">
                <div className="panel active" id="panel-payments">
                    <div className="page-top">
                        <div>
                            <div className="page-title">Payment Methods</div>
                            <div className="page-sub">
                                Enable or disable payment modes
                            </div>
                        </div>
                        <span className="status-badge badge-live">● Live</span>
                    </div>

                    {/* Accepted Payment Modes */}
                    <div className="section">
                        <div className="section-head">
                            <div className="section-icon" style={{ background: "var(--green-dim)" }}>💳</div>
                            <div>
                                <div className="section-title">Accepted Payment Modes</div>
                                <div className="section-desc">Select all modes your business accepts</div>
                            </div>
                        </div>
                        <div className="section-body">
                            <div className="method-grid">
                                {methods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`method-card ${method.is_enabled ? "selected" : ""}`}
                                        onClick={() => toggleMethod(method.id)}
                                    >
                                        <div className="method-top">
                                            <span className="method-icon">{method.icon}</span>
                                            <div className="method-check"></div>
                                        </div>
                                        <div className="method-name">{method.method_name}</div>
                                        <div className="method-sub">{method.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Payment Rules */}
                    <div className="section">
                        <div className="section-head">
                            <div className="section-icon" style={{ background: "var(--teal-dim)" }}>⚙️</div>
                            <div>
                                <div className="section-title">Payment Rules</div>
                                <div className="section-desc">Behavior when payments are recorded</div>
                            </div>
                        </div>
                        <div className="notif-section" style={{ padding: "0 22px" }}>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <div className="toggle-name">Auto-generate receipt on payment</div>
                                    <div className="toggle-desc">PDF receipt sent to customer after every EMI collected</div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={autoReceipt}
                                        onChange={() => setAutoReceipt(!autoReceipt)}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>

                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <div className="toggle-name">Allow partial payments</div>
                                    <div className="toggle-desc">Let customers pay less than full EMI amount</div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={allowPartial}
                                        onChange={() => setAllowPartial(!allowPartial)}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>

                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <div className="toggle-name">Allow advance payments</div>
                                    <div className="toggle-desc">Customers can pay future EMIs ahead of time</div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={allowAdvance}
                                        onChange={() => setAllowAdvance(!allowAdvance)}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>

                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <div className="toggle-name">Round off EMI to nearest ₹10</div>
                                    <div className="toggle-desc">Makes collection amounts cleaner</div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={roundOff}
                                        onChange={() => setRoundOff(!roundOff)}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
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
                            {saving ? "💾 Saving..." : "💾 Save Payment Settings"}
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


export default PaymentMethods;