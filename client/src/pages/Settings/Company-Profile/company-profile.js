import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";

const CompanyProfile = () => {
    const [companyName, setCompanyName] = useState("LoanPro Finance Pvt. Ltd.");
    const [registrationNumber, setRegistrationNumber] = useState("CIN: U65929TG2020PTC142857");
    const [gstin, setGstin] = useState("36AABCL1234A1ZX");
    const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
    const [address, setAddress] = useState("Plot 42, HITEC City, Hyderabad, Telangana - 500081");

    const markDirty = () => {
        console.log("Form changed");
    };

    const saveSettings = () => {
        console.log("Saving company profile...");
        // Add your save logic here (API call, localStorage, etc.)
    };

    return (
        <Layout>
            <div className="settings">
                <div className="panel" id="panel-company">
                    <div className="page-top">
                        <div>
                            <div className="page-title">Company Profile</div>
                            <div className="page-sub">
                                Details printed on receipts, statements, and PDFs
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-head">
                            <div className="section-icon" style={{ background: "var(--violet-dim)" }}>🏢</div>
                            <div>
                                <div className="section-title">Business Details</div>
                                <div className="section-desc">Appears on all customer-facing documents</div>
                            </div>
                        </div>
                        <div className="section-body">
                            <div className="form-grid">
                                <div className="field">
                                    <label className="field-label">Company Name</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => { setCompanyName(e.target.value); markDirty(); }}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">Registration Number</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={registrationNumber}
                                        onChange={(e) => { setRegistrationNumber(e.target.value); markDirty(); }}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">GSTIN</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={gstin}
                                        onChange={(e) => { setGstin(e.target.value); markDirty(); }}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">Support Phone</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={supportPhone}
                                        onChange={(e) => { setSupportPhone(e.target.value); markDirty(); }}
                                    />
                                </div>
                                <div className="field cols-1" style={{ gridColumn: "span 2" }}>
                                    <label className="field-label">Registered Address</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={address}
                                        onChange={(e) => { setAddress(e.target.value); markDirty(); }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-row">
                        <button className="btn btn-primary" onClick={saveSettings}>
                            💾 Save Company Profile
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CompanyProfile;
