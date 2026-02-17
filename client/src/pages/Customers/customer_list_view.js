import "../../App.css";
import React, { useEffect, useState } from 'react';

const Customer_list_view = ({ viewData }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (viewData) {
            const normalizedDate = viewData.dateOfBirth?.split("T")[0] || viewData.dateOfBirth;
            setFormData({ ...viewData, dateOfBirth: normalizedDate });
        }
        setStep(1);
    }, [viewData]);

    const [step, setStep] = useState(1);

    const steps = [
        { id: 1, name: "Personal Info" },
        { id: 2, name: "Additional Info" },
        { id: 3, name: "Verification (KYC)" },
        { id: 4, name: "Financial Info" },
    ];

    return (
        <div
            className="modal fade"
            id="viewCustomerModal"
            tabIndex="-1"
            aria-labelledby="viewCustomerModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered custom-modal-dialog-md">
                <div className="modal-content elegant-modal shadow-lg border-0">
                    <div className="modal-header border-0">
                        <h5 className="modal-title" id="viewCustomerModalLabel">
                            View Customer
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-tabs">
                        {steps.map((s) => (
                            <div
                                key={s.id}
                                className={`tab-item ${step === s.id ? "active" : ""}`}
                                onClick={() => setStep(s.id)}
                            >
                                {s.name}
                            </div>
                        ))}
                    </div>

                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="modal-body">
                            <div className="step-section">
                                <div className="row g-3">
                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Customer Id</label>
                                        <p className="form-control-plaintext">{formData.customer_id || "--"}</p>
                                    </div>
                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Profile Status</label>
                                        <p className="form-control-plaintext">{formData.profileStatus || "--"}</p>
                                    </div>
                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Title</label>
                                        <p className="form-control-plaintext">{formData.title || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">First Name</label>
                                        <p className="form-control-plaintext">{formData.firstName || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Last Name</label>
                                        <p className="form-control-plaintext">{formData.lastName || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Date of Birth</label>
                                        <p className="form-control-plaintext">{formData.dateOfBirth || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Gender</label>
                                        <p className="form-control-plaintext">{formData.gender || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Nationality</label>
                                        <p className="form-control-plaintext">{formData.nationality || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Phone Number</label>
                                        <p className="form-control-plaintext">{formData.phoneNumber || "--"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Step 2 */}
                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="modal-body">
                            <div className="step-section">
                                <div className="row g-3">

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Primary Phone Number</label>
                                        <p className="form-control-plaintext">{formData.primaryNumber || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Secondary Phone Number</label>
                                        <p className="form-control-plaintext">{formData.secondaryNumber || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Email</label>
                                        <p className="form-control-plaintext">{formData.email || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Address</label>
                                        <p className="form-control-plaintext">{formData.address || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">City</label>
                                        <p className="form-control-plaintext">{formData.city || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">State</label>
                                        <p className="form-control-plaintext">{formData.state || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Postal Code</label>
                                        <p className="form-control-plaintext">{formData.postalCode || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6 d-flex flex-column">
                                        <label className="form-label">Address Proof Document</label>
                                        <span>
                                        <a
                                            href={`http://localhost:5000/uploads/${formData.addressProofOriginal}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {formData.addressProofOriginal || '---'}
                                        </a>
                                        </span>
                                    </div>


                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Annual Income</label>
                                        <p className="form-control-plaintext">{formData.annualIncome || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Credit Score</label>
                                        <p className="form-control-plaintext">{formData.creditScore || "--"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="modal-body">
                            <div className="step-section">
                                <div className="row g-3">
                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Govt ID Type</label>
                                        <p className="form-control-plaintext">{formData.govtIdType || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Govt ID Number</label>
                                        <p className="form-control-plaintext">{formData.govtIdNumber || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">ID Issue Date</label>
                                        <p className="form-control-plaintext">{formData.idIssueDate || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">ID Expiry Date</label>
                                        <p className="form-control-plaintext">{formData.idExpiryDate || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6 d-flex flex-column">
                                        <label className="form-label">Document Id Upload</label>
                                        <span>
                                        <a
                                            href={`http://localhost:5000/uploads/${formData.idDocumentUploadOriginal}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {formData.idDocumentUploadOriginal || '---'}
                                        </a>
                                        </span>
                                    </div>

                                    <div className="mb-3 col-sm-6 d-flex flex-column">
                                        <label className="form-label">Photo of Customer</label>
                                        <span>
                                        <a
                                            href={`http://localhost:5000/uploads/${formData.customerPhotoOriginal}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {formData.customerPhotoOriginal || '---'}
                                        </a>
                                        </span>
                                    </div>





                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4 */}
                    {step === 4 && (
                        <div className="modal-body">
                            <div className="step-section">
                                <div className="row g-3">
                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Employment Status</label>
                                        <p className="form-control-plaintext">{formData.employmentStatus || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Company Name</label>
                                        <p className="form-control-plaintext">{formData.companyName || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Job Title</label>
                                        <p className="form-control-plaintext">{formData.jobTitle || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Monthly Income</label>
                                        <p className="form-control-plaintext">{formData.monthlyIncome || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Income Proof Document</label>
                                        <p className="form-control-plaintext">{formData.incomeProof || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Credit Score</label>
                                        <p className="form-control-plaintext">{formData.creditScore || "--"}</p>
                                    </div>

                                    <div className="mb-3 col-sm-6">
                                        <label className="form-label">Credit Score Band</label>
                                        <p className="form-control-plaintext">{formData.creditScoreBand || "--"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1}
                        >
                            Previous
                        </button>
                        {step < steps.length && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setStep(step + 1)}
                            >
                                Next
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customer_list_view;
