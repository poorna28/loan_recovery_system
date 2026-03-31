import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";

const Notifications = () => {

    const [paymentConfirm, setPaymentConfirm] = useState(true);
    const [emiReminder, setEmiReminder] = useState(true);
    const [overdueAlert, setOverdueAlert] = useState(true);
    const [loanClosure, setLoanClosure] = useState(true);

    // State for provider and sender ID
    const [smsProvider, setSmsProvider] = useState("Twilio");
    const [senderId, setSenderId] = useState("LOANPR");

    const markDirty = () => console.log("Form changed");
    const saveSettings = () => console.log("Saving notification settings...");
    const sendTestSMS = () => console.log("Sending test SMS...");


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
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>
                        </div>

                        {/* SMS Provider and Sender ID */}
                        <div style={{ padding: "8px 22px 16px" }}>
                            <div className="form-grid" style={{ marginTop: "12px" }}>
                                <div className="field">
                                    <label className="field-label">SMS Provider</label>
                                    <select
                                        className="input"
                                        value={smsProvider}
                                        onChange={(e) => { setSmsProvider(e.target.value); markDirty(); }}
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="btn-row">
                        <button className="btn btn-primary" onClick={saveSettings}>
                            💾 Save Notification Settings
                        </button>
                        <button className="btn btn-ghost" onClick={sendTestSMS}>
                            Send Test SMS
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Notifications;