import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";

const PaymentMethods = () => {

    // State for accepted methods
    const [methods, setMethods] = useState({
        Cash: true,
        UPI: true,
        "Bank Transfer": true,
        "Debit Card": false,
        "Net Banking": false,
        "Cheque / DD": false,
    });

    // State for payment rules
    const [autoReceipt, setAutoReceipt] = useState(true);
    const [allowPartial, setAllowPartial] = useState(false);
    const [allowAdvance, setAllowAdvance] = useState(true);
    const [roundOff, setRoundOff] = useState(true);

    const toggleMethod = (method) => {
        setMethods((prev) => ({ ...prev, [method]: !prev[method] }));
        console.log("Toggled method:", method);
    };

    const markDirty = () => console.log("Form changed");
    const saveSettings = () => console.log("Saving payment settings...");
    const discardChanges = () => console.log("Resetting payment settings...");


    return (
        <Layout>
            <div className="settings">
                <div className="panel active" id="panel-payments">
                    <div className="page-top">
                        <div>
                            <div className="page-title">Payment Methods</div>
                            <div className="page-sub">
                                Enable or disable payment modes · GET /api/settings/payment-methods
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
                                {Object.keys(methods).map((method) => (
                                    <div
                                        key={method}
                                        className={`method-card ${methods[method] ? "selected" : ""}`}
                                        onClick={() => toggleMethod(method)}
                                    >
                                        <div className="method-top">
                                            <span className="method-icon">
                                                {method === "Cash" && "💵"}
                                                {method === "UPI" && "📱"}
                                                {method === "Bank Transfer" && "🏦"}
                                                {method === "Debit Card" && "💳"}
                                                {method === "Net Banking" && "🌐"}
                                                {method === "Cheque / DD" && "📄"}
                                            </span>
                                            <div className="method-check"></div>
                                        </div>
                                        <div className="method-name">{method}</div>
                                        <div className="method-sub">
                                            {method === "Cash" && "In-person collection"}
                                            {method === "UPI" && "GPay, PhonePe, BHIM"}
                                            {method === "Bank Transfer" && "NEFT / RTGS / IMPS"}
                                            {method === "Debit Card" && "Visa, Mastercard, RuPay"}
                                            {method === "Net Banking" && "All major banks"}
                                            {method === "Cheque / DD" && "Post-dated cheques"}
                                        </div>
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
                                        onChange={() => { setAutoReceipt(!autoReceipt); markDirty(); }}
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
                                        onChange={() => { setAllowPartial(!allowPartial); markDirty(); }}
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
                                        onChange={() => { setAllowAdvance(!allowAdvance); markDirty(); }}
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
                                        onChange={() => { setRoundOff(!roundOff); markDirty(); }}
                                    />
                                    <div className="toggle-track"></div>
                                    <div className="toggle-thumb"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="btn-row">
                        <button className="btn btn-primary" onClick={saveSettings}>
                            💾 Save Payment Settings
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


export default PaymentMethods;