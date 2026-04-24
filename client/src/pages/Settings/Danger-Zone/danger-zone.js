import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";
import api from "../../../services/api";

const DangerZone = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const confirmReset = async () => {
        if (window.confirm("Are you sure you want to reset all settings? This cannot be undone. This will wipe all configuration but NOT affect loan and customer data.")) {
            try {
                setLoading(true);
                setError(null);
                const response = await api.post('/settings/reset-all');
                if (response.data.success) {
                    setMessage("✅ All settings have been reset to factory defaults");
                    setTimeout(() => setMessage(null), 3000);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to reset settings");
            } finally {
                setLoading(false);
            }
        }
    };

    const exportBackup = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/settings/export-backup', {
                responseType: 'blob'
            });
            
            // Create blob and download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `backup-${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            setMessage("✅ Database backup exported successfully");
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to export backup");
        } finally {
            setLoading(false);
        }
    };

    const purgeTestData = async () => {
        if (window.confirm("Are you sure you want to purge all test data? This action cannot be undone and will remove all records marked as test/demo.")) {
            try {
                setLoading(true);
                setError(null);
                const response = await api.post('/settings/purge-test-data');
                if (response.data.success) {
                    setMessage(`✅ ${response.data.deletedCount || 0} test records have been purged`);
                    setTimeout(() => setMessage(null), 3000);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to purge test data");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Layout>
            <div className="settings">
                <div className="panel" id="panel-danger">
                    <div className="page-top">
                        <div>
                            <div className="page-title" style={{ color: "var(--red)" }}>Danger Zone</div>
                            <div className="page-sub">
                                Irreversible actions. Proceed with extreme caution.
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-error" style={{ margin: "16px 22px" }}>
                            ❌ {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {message && (
                        <div className="alert alert-success" style={{ margin: "16px 22px" }}>
                            {message}
                        </div>
                    )}

                    <div className="section" style={{ borderColor: "rgba(240,80,96,0.2)" }}>
                        <div className="section-body">
                            <div className="toggle-row" style={{ padding: "16px 0" }}>
                                <div className="toggle-info">
                                    <div className="toggle-name" style={{ color: "var(--red)" }}>
                                        🔄 Reset all settings to factory defaults
                                    </div>
                                    <div className="toggle-desc">
                                        This will wipe all configuration. Loans and customer data are NOT affected. Settings can be reconfigured after reset.
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={confirmReset}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Reset Settings"}
                                </button>
                            </div>

                            <div className="toggle-row" style={{ padding: "16px 0" }}>
                                <div className="toggle-info">
                                    <div className="toggle-name" style={{ color: "var(--red)" }}>
                                        ⬇ Export full database backup
                                    </div>
                                    <div className="toggle-desc">
                                        Download a complete JSON export of all data (customers, loans, payments, settings). Use for disaster recovery or data migration.
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={exportBackup}
                                    disabled={loading}
                                >
                                    {loading ? "Exporting..." : "⬇ Export Backup"}
                                </button>
                            </div>

                            <div className="toggle-row" style={{ padding: "16px 0", borderBottom: "none" }}>
                                <div className="toggle-info">
                                    <div className="toggle-name" style={{ color: "var(--red)" }}>
                                        🗑 Purge all test data
                                    </div>
                                    <div className="toggle-desc">
                                        Remove all records marked as test/demo. This action cannot be undone. Only affects test records, live data remains intact.
                                    </div>
                                </div>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={purgeTestData}
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "🗑 Purge Test Data"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Warning Section */}
                    <div className="section" style={{ marginTop: "20px", borderLeft: "4px solid var(--red)" }}>
                        <div className="section-head">
                            <div className="section-icon" style={{ background: "rgba(240,80,96,0.12)" }}>⚠️</div>
                            <div>
                                <div className="section-title" style={{ color: "var(--red)" }}>Important Warnings</div>
                                <div className="section-desc">Read before proceeding</div>
                            </div>
                        </div>
                        <div style={{ padding: "16px 22px", lineHeight: "1.6" }}>
                            <p>
                                <strong>🔴 Critical:</strong> All actions in this section are <strong>permanent and cannot be reversed</strong> without a backup.
                            </p>
                            <p>
                                <strong>💾 Before you proceed:</strong> Always maintain a recent database backup. Click "Export Backup" to create one now.
                            </p>
                            <p>
                                <strong>👤 Admin Only:</strong> These actions should only be performed by system administrators. Contact your database team for assistance.
                            </p>
                            <p>
                                <strong>📞 Need help?</strong> Contact support before performing any dangerous operations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DangerZone;