import api from "../../services/api";
import "../../App.css";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ALLOWED_FILE_TYPES, getFileUrl } from '../../config/constants';
import { buildPayload } from '../../utils/queryBuilder';

const Customer_details = ({ editData, setEditData, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        // Step 1
        firstName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        profileStatus: '',
        title: '',
        lastName: '',
        gender: '',
        nationality: '',
        primaryNumber: '',
        secondaryNumber: '',
        city: '',
        state: '',
        postalCode: '',
        addressProof: null,
        annualIncome: '',
        creditScore: '',
        govtIdNumber: '',
        govtIdType: '',
        idDocumentUpload: null,
        customerPhoto: null,
        employmentStatus: '',
        jobTitle: '',
        incomeProofDocument: '',
    });

    const emptyForm = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        profileStatus: '',
        employmentStatus: '',
        annualIncome: '',
        creditScore: '',
        dateOfBirth: '',
        address: '',
        title: '',
        gender: '',
        nationality: '',
        primaryNumber: '',
        secondaryNumber: '',
        city: '',
        state: '',
        postalCode: '',
        addressProof: null,
        // idExpiryDate: '',
        // idIssueDate: '',
        govtIdNumber: '',
        govtIdType: '',
        idDocumentUpload: null,
        customerPhoto: null,
        // companyName: '',
        jobTitle: '',
        // monthlyIncome: '',
        incomeProofDocument: '',
        // creditScoreBand: '',
    };


    useEffect(() => {
        if (editData) {
            const normalizedDate = editData.dateOfBirth?.split('T')[0] || '';
            setFormData({
                ...emptyForm,
                ...editData,
                dateOfBirth: normalizedDate
            });

            setSelectedFileNames({
                addressProof: "",
                idDocumentUpload: "",
                customerPhoto: ""
            });



        } else {
            setFormData(emptyForm);
        }

        setErrors({});
        setShowAlert(false);
        setStep(1);
    }, [editData]);



    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFileNames, setSelectedFileNames] = useState({
        addressProof: "",
        idDocumentUpload: "",
        customerPhoto: ""
    });

    const validationRules = {
        profileStatus: {
            required: true,
            label: "Profile Status",
            step: 1
        },
        firstName: {
            required: true,
            label: "First Name",
            step: 1
        },
        lastName: {
            required: true,
            label: "Last Name",
            step: 1
        },
        phoneNumber: {
            required: true,
            label: "Phone Number",
            step: 1,
            pattern: /^[6-9]\d{9}$/,
            message: "Enter valid 10-digit Indian mobile number"
        },

        email: {
            required: true,
            label: "Email",
            step: 2,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter valid email address"
        },
        annualIncome: {
            required: true,
            label: "Annual Income",
            step: 2
        },

        creditScore: {
            required: true,
            label: "Credit Score",
            step: 2
        },

        employmentStatus: {
            required: true,
            label: "Employment Status",
            step: 4
        },

        govtIdType: {
            require: false,
            label: "Government ID Type",
            step: 3
        },

        govtIdNumber: {
            require: false,
            label: "Government ID Number",
            step: 3
        },
    };


    const [step, setStep] = useState(1);

    const onChange = (e) => {
        const { name, value, type, files } = e.target;

        // Phone: digits only
        if (name === "phoneNumber" && !/^\d*$/.test(value)) return;

        if (type === "file") {
            const file = files[0];

            setFormData(prev => ({
                ...prev,
                [name]: file || null
            }));

            setSelectedFileNames(prev => ({
                ...prev,
                [name]: file?.name || ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error on edit
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };


    const validateStep = (currentStep) => {
        const newErrors = {};

        Object.entries(validationRules).forEach(([field, rule]) => {
            if (rule.step !== currentStep) return;

            const value = formData[field];

            if (rule.required && !value) {
                newErrors[field] = `${rule.label} is required`;
                return;
            }

            if (rule.pattern && value && !rule.pattern.test(value)) {
                newErrors[field] = rule.message;
            }
        });

        if (currentStep === 3 && formData.govtIdNumber) {

            const idType = formData.govtIdType;
            const idNumber = formData.govtIdNumber;

            switch (idType) {

                case "National ID": // Aadhaar
                    if (!/^\d{12}$/.test(idNumber)) {
                        newErrors.govtIdNumber =
                            "Aadhaar must be exactly 12 digits";
                    }
                    break;

                case "Passport":
                    if (!/^[A-Z][0-9]{7}$/i.test(idNumber)) {
                        newErrors.govtIdNumber =
                            "Passport must be 1 letter followed by 7 digits";
                    }
                    break;

                case "Driver's License":
                    if (!/^[A-Z0-9]{15,16}$/i.test(idNumber)) {
                        newErrors.govtIdNumber =
                            "Driving License must be 15–16 characters";
                    }
                    break;

                case "Voter ID":
                    if (!/^[A-Z]{3}[0-9]{7}$/i.test(idNumber)) {
                        newErrors.govtIdNumber =
                            "Voter ID must be 3 letters followed by 7 digits";
                    }
                    break;

                default:
                    break;
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach(err => toast.error(err));
            return false;
        }

        return true;
    };


    const handleNext = () => {
        if (!validateStep(step)) return;
        setStep(prev => prev + 1);
    };


    const onSave = async () => {
        for (let s = 1; s <= steps.length; s++) {
            if (!validateStep(s)) {
                setStep(s);
                return;
            }
        }

        try {
            setIsSubmitting(true);

            // Ensure dateOfBirth is in 'YYYY-MM-DD' format
            const sanitizedDate = formData.dateOfBirth?.split('T')[0] || formData.dateOfBirth;

            const sanitizedFormData = {
                ...formData,
                dateOfBirth: sanitizedDate
            };

            // Build consistent payload (excludes auto-generated fields)
            const cleanPayload = buildPayload(
                sanitizedFormData,
                {
                    excludeFields: editData ? [] : ['customer_id', 'id'],
                    transformFields: {}
                }
            );

            const formPayload = new FormData();
            Object.entries(cleanPayload).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formPayload.append(key, value);
                }
            });

            const method = editData ? api.put : api.post;
            const url = editData ? `/customers/${editData.customer_id}` : '/customers';

            await method(url, formPayload);
            
            toast.success(editData ? 'Customer updated successfully!' : 'Customer created successfully!');

            setEditData(null);
            setErrors({});
            setShowAlert(false);

            // Refresh the customer list
            if (onSaveSuccess) {
                onSaveSuccess();
            }

            // Close the modal
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
            if (modal) {
                modal.hide();
            }
        } catch (err) {
            console.error('Error saving customer:', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error saving customer';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, name: 'Personal Info' },
        { id: 2, name: 'Additional Info' },
        { id: 3, name: 'Verification (KYC)' },
        { id: 4, name: 'Financial Info' }

    ];

    return (
        <>
            <div
                className="modal fade"
                id="addCustomerModal"
                tabIndex="-1"
                aria-labelledby="addCustomerModalLabel"
                aria-hidden="true"
            >



                <div className="modal-dialog modal-dialog-centered custom-modal-dialog">
                    <div className="modal-content elegant-modal shadow-lg border-0">

                        {/* Header */}
                        <div className="modal-header border-0">
                            <h5 className="modal-title">👥 {editData ? "Update Customer" : "Add New Customer"}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    setEditData(null);
                                    setShowAlert(false)
                                    setErrors({});
                                }}
                            ></button>
                        </div>

                        {/* Step Tabs */}
                        <div className="modal-tabs d-flex justify-content-around align-items-center mt-3 px-3">
                            {steps.map((s) => (
                                <div
                                    key={s.id}
                                    className={`tab-item flex-fill text-center py-2 ${step === s.id ? "active" : ""
                                        }`}
                                    onClick={() => setStep(s.id)}
                                >
                                    {s.name}
                                </div>
                            ))}
                        </div>

                        <hr className="mt-0 mb-3" />

                        {/* Modal Body */}
                        <div className="modal-body pt-0">
                            {/* Step 1 */}
                            {step === 1 && (
                                <div className="step-section p-3">

                                    <div className="row g-3">

                                        {/* Customer ID */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Customer ID</label>
                                            <input
                                                type="text"
                                                className="form-control auto-generated"
                                                name="customer_id"
                                                value={editData ? editData.customer_id : "Auto-generated"}
                                                readOnly disabled
                                            />
                                        </div>

                                        {/* Profile Status */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Profile Status <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                name="profileStatus"
                                                value={formData.profileStatus}
                                                onChange={onChange}
                                            >
                                                <option value="">Select Profile Status</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="OnHold">On Hold</option>
                                            </select>
                                            {errors.profileStatus && <small className="text-danger">{errors.profileStatus}</small>}
                                        </div>

                                        {/* Title */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Title</label>
                                            <select
                                                className="form-select"
                                                name="title"
                                                value={formData.title}
                                                onChange={onChange}
                                            >
                                                <option value="">Select Title</option>
                                                <option value="Mr">Mr</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Ms">Ms</option>
                                                <option value="Dr">Dr</option>
                                            </select>
                                        </div>

                                        {/* First Name */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">First Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                placeholder="Enter first name"
                                                value={formData.firstName}
                                                onChange={onChange}
                                            />
                                            {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                                        </div>

                                        {/* Last Name */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Last Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="lastName"
                                                placeholder="Enter last name"
                                                value={formData.lastName}
                                                onChange={onChange}
                                            />
                                            {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                                        </div>

                                        {/* Date of Birth */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Date of Birth</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Gender</label>
                                            <select
                                                className="form-select"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={onChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        {/* Nationality */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Nationality</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nationality"
                                                placeholder="e.g., Indian"
                                                value={formData.nationality}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* Phone Number */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phoneNumber"
                                                placeholder="Enter phone number"
                                                value={formData.phoneNumber}
                                                onChange={onChange}
                                            />
                                            {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                                        </div>
                                    </div>
                                </div>
                            )}



                            {/* Step 2 */}
                            {step === 2 && (
                                <div className="step-section p-3">
                                    <div className="row g-3">

                                        {/* Primary Phone Number */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Primary Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="primaryNumber"
                                                value={formData.primaryNumber}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* Secondary Phone Number */}
                                        {/* <div className="col-md-6">
                                            <label className="form-label">Secondary Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="secondaryNumber"
                                                value={formData.secondaryNumber}
                                                onChange={onChange}
                                            />
                                        </div> */}

                                        {/* Email */}
                                        <div className="col-md-6">
                                            <label className="form-label">Email <span className="text-danger">*</span></label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={onChange}
                                            />
                                            {errors.email && <small className="text-danger">{errors.email}</small>}
                                        </div>

                                        {/* Address */}
                                        <div className="col-md-6">
                                            <label className="form-label">Address</label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                rows="3"
                                                value={formData.address}
                                                onChange={onChange}
                                            ></textarea>
                                        </div>

                                        {/* City */}
                                        <div className="col-md-6">
                                            <label className="form-label">City</label>
                                            <select
                                                className="form-select"
                                                name="city"
                                                value={formData.city}
                                                onChange={onChange}
                                            >
                                                <option value="">Select City</option>
                                                <option value="New York">New York</option>
                                                <option value="Los Angeles">Los Angeles</option>
                                                <option value="Chicago">Chicago</option>
                                                <option value="Houston">Houston</option>
                                                <option value="Miami">Miami</option>
                                            </select>
                                        </div>

                                        {/* State */}
                                        <div className="col-md-6">
                                            <label className="form-label">State</label>
                                            <select
                                                className="form-select"
                                                name="state"
                                                value={formData.state}
                                                onChange={onChange}
                                            >
                                                <option value="">Select State</option>
                                                <option value="California">California</option>
                                                <option value="Texas">Texas</option>
                                                <option value="Florida">Florida</option>
                                                <option value="New York">New York</option>
                                                <option value="Illinois">Illinois</option>
                                            </select>
                                        </div>

                                        {/* Postal Code */}
                                        <div className="col-md-6">
                                            <label className="form-label">Postal Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* Address Proof */}
                                        <div className="col-md-6">
                                            <label className="form-label">Address Proof Document</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="addressProof"
                                                onChange={onChange}
                                                accept={ALLOWED_FILE_TYPES}
                                                disabled={isSubmitting}
                                            />
                                            {/* Show filename below input */}
                                            <div className="mt-1">

                                                {/* If user selected a new file */}
                                                {selectedFileNames.addressProof && (
                                                    <small>{selectedFileNames.addressProof}</small>
                                                )}

                                                {/* Otherwise show existing file from backend */}
                                                {!selectedFileNames.addressProof && editData?.addressProofOriginal && (
                                                    <a
                                                        href={getFileUrl(editData.addressProof)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {editData.addressProofOriginal}
                                                    </a>
                                                )}

                                            </div>
                                        </div>





                                        {/* Annual Income */}
                                        <div className="col-md-6">
                                            <label className="form-label">Annual Income <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="annualIncome"
                                                value={formData.annualIncome}
                                                onChange={onChange}
                                            />
                                            {errors.annualIncome && <small className="text-danger">{errors.annualIncome}</small>}
                                        </div>

                                        {/* Credit Score */}
                                        <div className="col-md-6">
                                            <label className="form-label">Credit Score <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                name="creditScore"
                                                value={formData.creditScore}
                                                onChange={onChange}
                                            >
                                                <option value="">Select Credit Score</option>
                                                <option value="Excellent (750-850)">Excellent (750-850)</option>
                                                <option value="Good (700-749)">Good (700-749)</option>
                                                <option value="Fair (650-699)">Fair (650-699)</option>
                                                <option value="Poor (600-649)">Poor (600-649)</option>
                                                <option value="Very Poor (<600)">Very Poor (&lt;600)</option>
                                            </select>
                                            {errors.creditScore && <small className="text-danger">{errors.creditScore}</small>}
                                        </div>

                                    </div>
                                </div>
                            )}


                            {step === 3 && (
                                <div className="step-section p-3">
                                    <div className="row g-3">

                                        {/* Government ID Type */}
                                        <div className="col-md-6">
                                            <label className="form-label">Government ID Type</label>
                                            <select
                                                className="form-select"
                                                name="govtIdType"
                                                value={formData.govtIdType}
                                                onChange={onChange}
                                            >
                                                <option value="">Select ID Type</option>
                                                <option value="National ID">National ID</option>
                                                <option value="Passport">Passport</option>
                                                <option value="Driver's License">Driver's License</option>
                                                <option value="Voter ID">Voter ID</option>
                                            </select>
                                        </div>

                                        {/* Government ID Number */}
                                        <div className="col-md-6">
                                            <label className="form-label">Government ID Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="govtIdNumber"
                                                value={formData.govtIdNumber}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* ID Issue Date */}
                                        {/* <div className="col-md-6">
                                            <label className="form-label">ID Issue Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="idIssueDate"
                                                value={formData.idIssueDate}
                                                onChange={onChange}
                                            />
                                        </div> */}

                                        {/* ID Expiry Date */}
                                        {/* <div className="col-md-6">
                                            <label className="form-label">ID Expiry Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="idExpiryDate"
                                                value={formData.idExpiryDate}
                                                onChange={onChange}
                                            />
                                        </div> */}

                                        <div className="col-md-6">
                                            <label className="form-label"> Document Id Upload</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="idDocumentUpload"
                                                onChange={onChange}
                                                accept={ALLOWED_FILE_TYPES}
                                                disabled={isSubmitting}
                                            />
                                            {/* Show filename below input */}
                                            <div className="mt-1">

                                                {/* If user selected a new file */}
                                                {selectedFileNames.idDocumentUpload && (
                                                    <small>{selectedFileNames.idDocumentUpload}</small>
                                                )}

                                                {/* Otherwise show existing file from backend */}
                                                {!selectedFileNames.idDocumentUpload && editData?.idDocumentUploadOriginal && (
                                                    <a
                                                        href={getFileUrl(editData.idDocumentUpload)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {editData.idDocumentUploadOriginal}
                                                    </a>
                                                )}

                                            </div>
                                        </div>






                                        {/* Customer Photo */}
                                        <div className="col-md-6">
                                            <label className="form-label">Photo of Customer</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="customerPhoto"
                                                onChange={onChange}
                                                accept={ALLOWED_FILE_TYPES}
                                                disabled={isSubmitting}
                                            />

                                            {/* Show filename below input */}
                                            <div className="mt-1">

                                                {/* If user selected a new file */}
                                                {selectedFileNames.customerPhoto && (
                                                    <small>{selectedFileNames.customerPhoto}</small>
                                                )}

                                                {/* Otherwise show existing file from backend */}
                                                {!selectedFileNames.customerPhoto && editData?.customerPhotoOriginal && (
                                                    <a
                                                        href={getFileUrl(editData.customerPhoto)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {editData.customerPhotoOriginal}
                                                    </a>
                                                )}

                                            </div>

                                        </div>



                                    </div>
                                </div>
                            )}


                            {step === 4 && (
                                <div className="step-section p-3">
                                    <div className="row g-3">

                                        {/* Employment Status */}
                                        <div className="col-md-6">
                                            <label className="form-label">Employment Status <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                name="employmentStatus"
                                                value={formData.employmentStatus}
                                                onChange={onChange}
                                            >
                                                <option value="">Select Employment Status</option>
                                                <option value="Employed">Employed</option>
                                                <option value="Self-Employed">Self-Employed</option>
                                                <option value="Unemployed">Unemployed</option>
                                                <option value="Student">Student</option>
                                                <option value="Retired">Retired</option>
                                            </select>
                                            {errors.employmentStatus && <small className="text-danger">{errors.employmentStatus}</small>}
                                        </div>

                                        {/* Company Name */}
                                        {/* <div className="col-md-6">
                                            <label className="form-label">Company Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={onChange}
                                            />
                                        </div> */}

                                        {/* Job Title */}
                                        <div className="col-md-6">
                                            <label className="form-label">Job Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="jobTitle"
                                                value={formData.jobTitle}
                                                onChange={onChange}
                                            />
                                        </div>

                                        {/* Monthly Income */}
                                        {/* <div className="col-md-6">
                                            <label className="form-label">Monthly Income</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="monthlyIncome"
                                                value={formData.monthlyIncome}
                                                onChange={onChange}
                                            />
                                        </div> */}

                                        {/* Income Proof Document */}
                                        <div className="col-md-6">
                                            <label className="form-label">Income Proof Document</label>
                                            <select
                                                className="form-select"
                                                name="incomeProofDocument"
                                                value={formData.incomeProofDocument}
                                                onChange={onChange}
                                            >
                                                <option value="">Select Income Proof Document</option>
                                                <option value="Pay Slips">Pay Slips</option>
                                                <option value="Bank Statements">Bank Statements</option>
                                                <option value="Tax Return">Tax Return</option>
                                            </select>
                                        </div>

                                        {/* Credit Score */}
                                        {/* <div className="col-md-6">
                                            <label className="form-label">Credit Score</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="creditScore"
                                                value={formData.creditScore}
                                                onChange={onChange}
                                            />
                                        </div> */}

                                        {/* Credit Score Band */}
                                        {/* <div className="col-md-6">
                                            <label className="form-label">Credit Score Band</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="creditScoreBand"
                                                value={formData.creditScoreBand}
                                                onChange={onChange}
                                            />
                                        </div> */}

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setStep(step - 1)}
                                disabled={step === 1 || isSubmitting}
                            >
                                ← Previous
                            </button>
                            {step < steps.length && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                >
                                    Next →
                                </button>
                            )}
                            {step === steps.length && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={onSave}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {editData ? "⏳ Updating..." : "⏳ Saving..."}
                                        </>
                                    ) : (
                                        editData ? "✓ Update Customer" : "✓ Save Customer"
                                    )}
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setEditData(null);
                                    setShowAlert(false)
                                    setErrors({});
                                }}
                                disabled={isSubmitting}
                            >
                                ✕ Close
                            </button>

                        </div>
                    </div>
                </div>
            </div>

        </>

    );
}

export default Customer_details;