import React, { useState, useEffect, useCallback } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";

const Notifications = () => {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    const [paymentConfirm, setPaymentConfirm] = useState(true);
    const [emiReminder, setEmiReminder] = useState(true);
    const [overdueAlert, setOverdueAlert] = useState(true);
    const [loanClosure, setLoanClosure] = useState(true);

    // State for provider and sender ID
    const [smsProvider, setSmsProvider] = useState("Twilio");
    const [senderId, setSenderId] = useState("LOANPR");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [adminNotifications, setAdminNotifications] = useState(true);

    const [isDirty, setIsDirty] = useState(false);

    const fetchNotificationSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings/notifications');
            if (response.data.success) {
                const settings = response.data.settings;
                setPaymentConfirm(settings.payment_confirmation_sms ?? true);
                setEmiReminder(settings.emi_reminder_sms ?? true);
                setOverdueAlert(settings.overdue_alert_sms ?? true);
                setLoanClosure(settings.loan_closure_message ?? true);
                setSmsProvider(settings.sms_provider ?? "Twilio");
                setSenderId(settings.sender_id ?? "LOANPR");
                setEmailNotifications(settings.email_notifications ?? true);
                setAdminNotifications(settings.admin_notifications ?? true);
            }
        } catch (err) {
            setError("Failed to load notification settings");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch existing settings on mount
    useEffect(() => {
        fetchNotificationSettings();
    }, [fetchNotificationSettings]);

    const markDirty = () => {
        setIsDirty(true);
        setSaved(false);
    };

    const saveSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            setSaved(false);

            const payload = {
                payment_confirmation_sms: paymentConfirm,
                emi_reminder_sms: emiReminder,
                overdue_alert_sms: overdueAlert,
                loan_closure_message: loanClosure,
                sms_provider: smsProvider,
                sender_id: senderId,
                email_notifications: emailNotifications,
                admin_notifications: adminNotifications
            };

            const response = await api.put('/settings/notifications', payload);
            if (response.data.success) {
                setSaved(true);
                setIsDirty(false);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save notification settings");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sendTestSMS = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/settings/notifications/test-sms', {
                sms_provider: smsProvider,
                sender_id: senderId
            });

            if (response.data.success) {
                alert("Test SMS sent successfully!");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send test SMS");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="settings">
                <div className="panel" id="panel-notifications">
                    <div className="page-top">
                        <div>
                            <div className="page-title">Notifications</div>
                            <div className="page-sub">
                                Control when and how alerts are sent to customers &amp; admins
                            </div>
                        </div>
                    </div>

                    {error && <div className="alert alert-error" style={{ margin: "16px 22px" }}>{error}</div>}
                    {saved && <div className="alert alert-success" style={{ margin: "16px 22px" }}>✅ Settings saved successfully!</div>}

                    {/* Customer Notifications */}
                    <div className="section">
                        <div className="section-head">
                            <div className="section-icon" style={{ background: "var(--blue-dim)" }}>📱</div>
                            <div>
                                <div className="section-title">Customer Notifications</div>
                                <div className="section-desc">Automated messages sent to borrowers</div>
                            </div>
                        </div>
                        <div className="notif-section">
                            <div className="notif-row">
                                <div className="notif-left">
                                    <div className="notif-icon" style={{ background: "var(--green-dim)" }}>✅</div>
                                    <div>
                                        <div className="notif-name">Payment confirmation SMS</div>
                                        <div className="notif-desc">Sent after every successful EMI payment</div>
                                    </div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={paymentConfirm}
                                        onChange={() => { setPaymentConfirm(!paymentConfirm); markDirty(); }}
                                        disabled={loading}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>

                            <div className="notif-row">
                                <div className="notif-left">
                                    <div className="notif-icon" style={{ background: "var(--amber-dim)" }}>📅</div>
                                    <div>
                                        <div className="notif-name">EMI due reminder</div>
                                        <div className="notif-desc">Reminder SMS 3 days before due date</div>
                                    </div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={emiReminder}
                                        onChange={() => { setEmiReminder(!emiReminder); markDirty(); }}
                                        disabled={loading}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>

                            <div className="notif-row">
                                <div className="notif-left">
                                    <div className="notif-icon" style={{ background: "var(--red-dim)" }}>⚠️</div>
                                    <div>
                                        <div className="notif-name">Overdue alert SMS</div>
                                        <div className="notif-desc">Sent when EMI is missed (Day 1, 7, 30)</div>
                                    </div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={overdueAlert}
                                        onChange={() => { setOverdueAlert(!overdueAlert); markDirty(); }}
                                        disabled={loading}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>

                            <div className="notif-row">
                                <div className="notif-left">
                                    <div className="notif-icon" style={{ background: "var(--violet-dim)" }}>🎉</div>
                                    <div>
                                        <div className="notif-name">Loan closure message</div>
                                        <div className="notif-desc">Congratulations SMS when loan is fully paid</div>
                                    </div>
                                </div>
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={loanClosure}
                                        onChange={() => { setLoanClosure(!loanClosure); markDirty(); }}
                                        disabled={loading}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>
                        </div>

                        {/* Email & Admin Notifications */}
                        <div style={{ padding: "8px 22px 16px" }}>
                            <div className="form-grid">
                                <div className="notif-row" style={{ paddingBottom: "12px" }}>
                                    <div className="notif-left">
                                        <div className="notif-icon" style={{ background: "var(--blue-dim)" }}>📧</div>
                                        <div>
                                            <div className="notif-name">Email Notifications</div>
                                            <div className="notif-desc">Send email alerts for important events</div>
                                        </div>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={emailNotifications}
                                            onChange={() => { setEmailNotifications(!emailNotifications); markDirty(); }}
                                            disabled={loading}
                                        />
                                        <div className="toggle-track"></div>
                                        <div className="toggle-thumb"></div>
                                    </label>
                                </div>
                                <div className="notif-row">
                                    <div className="notif-left">
                                        <div className="notif-icon" style={{ background: "var(--amber-dim)" }}>👨‍💼</div>
                                        <div>
                                            <div className="notif-name">Admin Notifications</div>
                                            <div className="notif-desc">Alert admins on overdue and risky loans</div>
                                        </div>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={adminNotifications}
                                            onChange={() => { setAdminNotifications(!adminNotifications); markDirty(); }}
                                            disabled={loading}
                                        />
                                        <div className="toggle-track"></div>
                                        <div className="toggle-thumb"></div>
                                    </label>
                                </div>
                            </div>

                            {/* SMS Provider and Sender ID */}
                            <div className="form-grid" style={{ marginTop: "12px" }}>
                                <div className="field">
                                    <label className="field-label">SMS Provider</label>
                                    <select
                                        className="input"
                                        value={smsProvider}
                                        onChange={(e) => { setSmsProvider(e.target.value); markDirty(); }}
                                        disabled={loading}
                                    >
                                        <option>Twilio</option>
                                        <option>MSG91</option>
                                        <option>Fast2SMS</option>
                                        <option>TextLocal</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label className="field-label">Sender ID</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={senderId}
                                        placeholder="6-char sender ID"
                                        onChange={(e) => { setSenderId(e.target.value); markDirty(); }}
                                        disabled={loading}
                                        maxLength="6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="btn-row">
                        <button 
                            className="btn btn-primary" 
                            onClick={saveSettings}
                            disabled={loading || !isDirty}
                        >
                            {loading ? "💾 Saving..." : "💾 Save Notification Settings"}
                        </button>
                        <button 
                            className="btn btn-ghost" 
                            onClick={sendTestSMS}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Test SMS"}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Notifications;