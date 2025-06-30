import api from "../../services/api";
import "../../App.css";
import Layout from "../../components/Layout/Layout";
import React, { useEffect, useState } from 'react';
import Basic_Info from "./baisc_information";
const Basic_Info_Creation_Modal = ({ editData, setEditData }) => {
        const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        PhoneNumber: '',
        dateOfBirth: '',
        address: '',
        EmploymentStatus: '',
        AnnualIncome: '',
        creditScore: ''
    });

        useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                firstName: '',
                email: '',
                PhoneNumber: '',
                dateOfBirth: '',
                address: '',
                EmploymentStatus: '',
                AnnualIncome: '',
                creditScore: ''
            });
        }
    }, [editData]);

        const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const onSave = () => {
        const method = editData ? api.put : api.post;
        const url = editData ? `/api/customers/${editData.customerId}` : '/api/customers';

        method(url, formData)
            .then(() => {
                setEditData(null);
                window.location.reload();
            })
            .catch(err => {
                alert('Error saving customer');
            });
    };

    return (
        <>
        <div className="modal fade" id="addCustomerModal"tabIndex="-1" aria-labelledby="addCustomerModalLabel"aria-hidden="true">
           <div className="modal-dialog modal-dialog-centered custom-modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title" id="addCustomerModalLabel">Add Customer</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body row">
                        <div className="mb-3 col-sm-4">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="firstName"
                                value={formData.firstName}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-3 col-sm-4">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                            />
                        </div>
                           <div className="mb-3 col-sm-4">
                            <label className="form-label">Phone	Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="PhoneNumber"
                                value={formData.PhoneNumber}
                                onChange={onChange}
                            />
                        </div>
                    </div>
                    <div className="modal-body row">
                     

                        <div className="mb-3 col-sm-4">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                className="form-control"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-3 col-sm-4">
                            <label className="form-label">Address</label>
                            <textarea
                                className="form-control"
                                name="address"
                                rows="3"
                                value={formData.address}
                                onChange={onChange}
                            ></textarea>
                            </div>
                              <div className="mb-3 col-sm-4">
                        <label className="form-label">Employment Status</label>
                        <select
                        className="form-control"
                        name="EmploymentStatus"
                        value={formData.EmploymentStatus}
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

                    </div>
                    <div className="modal-body row">
                   

                    <div className="mb-3 col-sm-4">
                        <label className="form-label">Annual Income</label>
                        <input
                        type="text"
                        className="form-control"
                        name="AnnualIncome"
                        value={formData.AnnualIncome}
                        onChange={onChange}
                        />
                    </div>

                    <div className="mb-3 col-sm-4">
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


                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={onSave}>Save</button>
                    </div>

                </div>
            </div>
        </div>
        </>

    );
}

export default Basic_Info_Creation_Modal;