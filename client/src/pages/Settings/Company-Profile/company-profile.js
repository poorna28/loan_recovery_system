import React, { useState, useEffect } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";
import { toast } from "react-toastify";

const CompanyProfile = () => {
    const [companyName, setCompanyName] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [gstin, setGstin] = useState("");
    const [supportPhone, setSupportPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch company profile on component mount
    useEffect(() => {
        fetchCompanyProfile();
    }, []);

    const fetchCompanyProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings/company-profile');
            if (response.data.success) {
                const settings = response.data.settings;
                setCompanyName(settings.company_name || "");
                setRegistrationNumber(settings.registration_number || "");
                setGstin(settings.gstin || "");
                setSupportPhone(settings.support_phone || "");
                setAddress(settings.address || "");
            }
        } catch (error) {
            console.error('Error fetching company profile:', error);
            toast.error(error.response?.data?.message || 'Failed to load company profile');
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        try {
            // Validate required fields
            if (!companyName.trim()) {
                toast.error('Company name is required');
                return;
            }

            setSaving(true);
            const payload = {
                company_name: companyName,
                registration_number: registrationNumber,
                gstin: gstin,
                support_phone: supportPhone,
                address: address
            };

            const response = await api.put('/settings/company-profile', payload);
            
            if (response.data.success) {
                toast.success('Company profile saved successfully');
            } else {
                toast.error(response.data.message || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving company profile:', error);
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => toast.error(err));
            } else {
                toast.error(error.response?.data?.message || 'Failed to save company profile');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="settings">
                    <div className="panel" id="panel-company">
                        <div style={{ padding: "40px", textAlign: "center" }}>
                            Loading company profile...
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

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
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">Registration Number</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={registrationNumber}
                                        onChange={(e) => setRegistrationNumber(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">GSTIN</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={gstin}
                                        onChange={(e) => setGstin(e.target.value)}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">Support Phone</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={supportPhone}
                                        onChange={(e) => setSupportPhone(e.target.value)}
                                    />
                                </div>
                                <div className="field cols-1" style={{ gridColumn: "span 2" }}>
                                    <label className="field-label">Registered Address</label>
                                    <input
                                        className="input"
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-row">
                        <button 
                            className="btn btn-primary" 
                            onClick={saveSettings}
                            disabled={saving}
                        >
                            {saving ? "💾 Saving..." : "💾 Save Company Profile"}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CompanyProfile;
