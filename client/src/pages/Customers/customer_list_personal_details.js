import api from "../../services/api";
import "../../App.css";
import Layout from "../../components/Layout/Layout";
import React, { useEffect, useState } from 'react';
import Basic_Info from "./customer_list";
const Customer_list_personal_details = ({ editData, setEditData }) => {
    const [formData, setFormData] = useState({
        // Step 1
        firstName: '',
        email: '',
        PhoneNumber: '',
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
        idExpiryDate: '',
        annualIncome: '',
        creditScore: '',
        idIssueDate: '',
        govtIdNumber: '',
        govtIdType: '',
        idDocumentUpload: null,
        customerPhoto: null,
        employmentStatus: '',
        companyName: '',
        jobTitle: '',
        monthlyIncome: '',
        incomeProofDocument: '',
        creditScore: '',
        creditScoreBand: '',






    });

    useEffect(() => {
        if (editData) {
            const normalizedDate = editData.dateOfBirth?.split('T')[0] || editData.dateOfBirth;
            setFormData({ ...editData, dateOfBirth: normalizedDate });
        } else {
            setFormData({
                firstName: '',
                email: '',
                PhoneNumber: '',
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
                idExpiryDate: '',
                annualIncome: '',
                creditScore: '',
                idIssueDate: '',
                govtIdNumber: '',
                govtIdType: '',
                idDocumentUpload: null,
                customerPhoto: null,
                employmentStatus: '',
                companyName: '',
                jobTitle: '',
                monthlyIncome: '',
                incomeProofDocument: '',
                creditScore: '',
                creditScoreBand: '',

            });
        }
    }, [editData]);


    const [step, setStep] = useState(1);

    const onChange = (e) => {
        const { name, value, type, files } = e.target;

        // Special handling for file uploads
        if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0] || null
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };
    const onSave = () => {
        // Ensure dateOfBirth is in 'YYYY-MM-DD' format
        const sanitizedDate = formData.dateOfBirth?.split('T')[0] || formData.dateOfBirth;

        const sanitizedFormData = {
            ...formData,
            dateOfBirth: sanitizedDate
        };

        console.log('PUT URL:', `/customers/${editData?.customer_id}`);
        console.log('Updating customer with:', sanitizedFormData);

        const method = editData ? api.put : api.post;
        const url = editData ? `/customers/${editData.customer_id}` : '/basic_info';

        method(url, sanitizedFormData)
            .then(() => {
                setEditData(null);
                window.location.reload(); // Optional: consider refreshing only the customer list instead
            })
            .catch(err => {
                console.error('Error saving customer:', err);
                alert('Error saving customer');
            });
    };

    const steps = [
        { id: 1, name: 'Personal Info' },
        { id: 2, name: 'Additional Info' },
        { id: 3, name: 'Verification (KYC)' },
        { id: 4, name: 'Financial Info' }

    ];

    return (
        <>
            <div className="modal fade" id="addCustomerModal" tabIndex="-1" aria-labelledby="addCustomerModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered custom-modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="addCustomerModalLabel">Add Customer</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body row">
                            <div className="d-flex mb-3">
                                {steps.map(s => (
                                    <div key={s.id}
                                        className={`flex-fill text-center p-2 border ${step === s.id ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                                        style={{ cursor: 'pointer', height: '30px', width: '30px' }} onClick={() => setStep(s.id)}>{s.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Step 1 */}
                        {step === 1 && (
                            <div className="row">
                                {/* Customer Id */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Customer Id</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="customer_id"
                                        value={editData ? editData.customer_id : "Auto-generated"}
                                        readOnly
                                    />
                                </div>

                                {/* Profile Status */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Profile Status</label>
                                    <select
                                        className="form-control"
                                        name="profileStatus"
                                        value={formData.profileStatus}
                                        onChange={onChange}
                                    >
                                        <option value="">Select Profile Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="OnHold">On Hold</option>
                                    </select>
                                </div>

                                {/* Title */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Title</label>
                                    <select
                                        className="form-control"
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
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Gender */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Gender</label>
                                    <select
                                        className="form-control"
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
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Nationality</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        )}


                        {/* Step 2 */}
                        {step === 2 && (
                            <div className="row">

                                {/* Primary Phone Number */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Primary Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="primaryNumber"
                                        value={formData.primaryNumber}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Secondary Phone Number */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Secondary Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="secondaryNumber"
                                        value={formData.secondaryNumber}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Address */}
                                <div className="mb-3 col-sm-6">
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
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">City</label>
                                    <select
                                        className="form-control"
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
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">State</label>
                                    <select
                                        className="form-control"
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
                                <div className="mb-3 col-sm-6">
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
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Address Proof Document</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="addressProof"
                                        onChange={onChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                </div>

                                {/* Annual Income */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Annual Income</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="annualIncome"
                                        value={formData.annualIncome}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Credit Score */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Credit Score</label>
                                    <select
                                        className="form-control"
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
                                </div>

                            </div>
                        )}


                        {step === 3 && (
                            <div className="row">

                                {/* Government ID Type */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Government ID Type</label>
                                    <select
                                        className="form-control"
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
                                <div className="mb-3 col-sm-6">
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
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">ID Issue Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="idIssueDate"
                                        value={formData.idIssueDate}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* ID Expiry Date */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">ID Expiry Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="idExpiryDate"
                                        value={formData.idExpiryDate}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* ID Document Upload */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">ID Document Upload</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="idDocumentUpload"
                                        onChange={onChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                </div>

                                {/* Customer Photo */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Photo of Customer</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="customerPhoto"
                                        onChange={onChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                </div>

                            </div>
                        )}


                        {step === 4 && (
                            <div className="row">

                                {/* Employment Status */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Employment Status</label>
                                    <select
                                        className="form-control"
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
                                </div>

                                {/* Company Name */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Job Title */}
                                <div className="mb-3 col-sm-6">
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
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Monthly Income</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="monthlyIncome"
                                        value={formData.monthlyIncome}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Income Proof Document */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Income Proof Document</label>
                                    <select
                                        className="form-control"
                                        name="incomeProof"
                                        value={formData.incomeProof}
                                        onChange={onChange}
                                    >
                                        <option value="">Select Income Proof Document</option>
                                        <option value="Pay Slips">Pay Slips</option>
                                        <option value="Bank Statements">Bank Statements</option>
                                        <option value="Tax Return">Tax Return</option>
                                    </select>
                                </div>

                                {/* Credit Score */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Credit Score</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="creditScore"
                                        value={formData.creditScore}
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Credit Score Band */}
                                <div className="mb-3 col-sm-6">
                                    <label className="form-label">Credit Score Band</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="creditScoreBand"
                                        value={formData.creditScoreBand}
                                        onChange={onChange}
                                    />
                                </div>

                            </div>
                        )}


                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)} disabled={step === 1}>Previous</button>
                            {step < steps.length && <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>Next</button>}
                            {step === steps.length && <button type="button" className="btn btn-success" onClick={onSave}>{editData ? 'Update' : 'Save'}</button>}
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        </div>

                    </div>
                </div>
            </div>
        </>

    );
}

export default Customer_list_personal_details;