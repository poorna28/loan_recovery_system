import React, { useState } from "react";
import "../Company-Profile/company-profile.css";
import Layout from "../../../components/Layout/Layout";


const DangerZone = () => {

    const confirmReset = () => {
        if (window.confirm("Are you sure you want to reset all settings? This cannot be undone.")) {
            console.log("Settings reset to factory defaults");
            // Add reset logic here
        }
    };

    const exportBackup = () => {
        console.log("Exporting full database backup...");
        // Add export logic here
    };

    const purgeTestData = () => {
        if (window.confirm("Are you sure you want to purge all test data? This cannot be undone.")) {
            console.log("Purging test/demo data...");
            // Add purge logic here
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

                    <div className="section" style={{ borderColor: "rgba(240,80,96,0.2)" }}>
                        <div className="section-body">
                            <div className="toggle-row" style={{ padding: "16px 0" }}>
                                <div className="toggle-info">
                                    <div className="toggle-name" style={{ color: "var(--red)" }}>
                                        Reset all settings to factory defaults
                                    </div>
                                    <div className="toggle-desc">
                                        This will wipe all configuration. Loans and customer data are NOT affected.
                                    </div>
                                </div>
                                <button className="btn btn-danger" onClick={confirmReset}>
                                    Reset Settings
                                </button>
                            </div>

                            <div className="toggle-row" style={{ padding: "16px 0" }}>
                                <div className="toggle-info">
                                    <div className="toggle-name" style={{ color: "var(--red)" }}>
                                        Export full database backup
                                    </div>
                                    <div className="toggle-desc">
                                        Download a complete JSON export of all data (customers, loans, payments)
                                    </div>
                                </div>
                                <button className="btn btn-danger" onClick={exportBackup}>
                                    ⬇ Export Backup
                                </button>
                            </div>

                            <div className="toggle-row" style={{ padding: "16px 0", borderBottom: "none" }}>
                                <div className="toggle-info">
                                    <div className="toggle-name" style={{ color: "var(--red)" }}>
                                        Purge all test data
                                    </div>
                                    <div className="toggle-desc">
                                        Remove all records marked as test/demo. Cannot be undone.
                                    </div>
                                </div>
                                <button className="btn btn-danger" onClick={purgeTestData}>
                                    🗑 Purge Test Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export default DangerZone;