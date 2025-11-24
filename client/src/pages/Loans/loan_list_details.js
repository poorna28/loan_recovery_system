import React, { useState, useEffect } from "react";
import api from "../../services/api";

const Loan_List_Details = ({ editData, setEditData, onSaved }) => {
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanPurpose: "",
    interestRate: "",
    loanTerm: "",
    applicationDate: "",
    statusApproved: "",
    monthlyPayment: "",
    nextPaymentDue: "",
    remainingBalance: ""
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        loanAmount: editData.loanAmount || "",
        loanPurpose: editData.loanPurpose || "",
        interestRate: editData.interestRate || "",
        loanTerm: editData.loanTerm || "",
        applicationDate: editData.applicationDate || "",
        statusApproved: editData.statusApproved || "",
        monthlyPayment: editData.monthlyPayment || "",
        nextPaymentDue: editData.nextPaymentDue || "",
        remainingBalance: editData.remainingBalance || ""
      });
    } else {
      setFormData({
        loanAmount: "",
        loanPurpose: "",
        interestRate: "",
        loanTerm: "",
        applicationDate: "",
        statusApproved: "",
        monthlyPayment: "",
        nextPaymentDue: "",
        remainingBalance: ""
      });
    }
  }, [editData]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const payload = { ...formData };

    const apiCall = editData
      ? api.put(`/loan_customers/${editData.loan_customer_id}`, payload)
      : api.post("/loan_customers", payload);

    apiCall
      .then(() => {
        alert(`Loan customer ${editData ? "updated" : "added"} successfully!`);
        // close modal (Bootstrap auto on success if you trigger button), refresh list using callback
        if (onSaved) onSaved();
        // clear edit state
        if (setEditData) setEditData(null);
        // optionally hide modal manually if needed
      })
      .catch(err => {
        console.error("Error saving loan customer:", err);
        alert("Failed to save loan customer.");
      });
  };

  return (
    <div
      className="modal fade"
      id="addLoanCustomerModal"
      aria-labelledby="addLoanCustomerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered custom-modal-dialog">
        <div className="modal-content elegant-modal shadow-lg border-0">
          <div className="modal-header border-0 pb-0">
            <div className="w-100 d-flex justify-content-between align-items-center">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>

          <div className="step-section p-3">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Loan ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="loan_id"
                  value={editData ? editData.loan_id : "Auto-generated"}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Loan Amount</label>
                <input
                  type="text"
                  className="form-control"
                  name="loanAmount"
                  placeholder="Enter loan amount"
                  value={formData.loanAmount}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Loan Purpose</label>
                <select className="form-select" name="loanPurpose" value={formData.loanPurpose} onChange={onChange}>
                  <option value="">Select loanPurpose</option>
                  <option value="Home">Home</option>
                  <option value="Educational">Educational</option>
                  <option value="Gold">Gold</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Interest Rate</label>
                <input
                  type="text"
                  className="form-control"
                  name="interestRate"
                  placeholder="Enter interest rate"
                  value={formData.interestRate}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Loan Term</label>
                <input
                  type="text"
                  className="form-control"
                  name="loanTerm"
                  placeholder="Enter loan term"
                  value={formData.loanTerm}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Application Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Status Approved</label>
                <select className="form-select" name="statusApproved" value={formData.statusApproved} onChange={onChange}>
                  <option value="">Select Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Not Approved">Not Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Monthly Payment</label>
                <input
                  type="text"
                  className="form-control"
                  name="monthlyPayment"
                  placeholder="Enter monthly payment"
                  value={formData.monthlyPayment}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Next Payment Due</label>
                <input
                  type="date"
                  className="form-control"
                  name="nextPaymentDue"
                  value={formData.nextPaymentDue}
                  onChange={onChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Remaining Balance</label>
                <input
                  type="text"
                  className="form-control"
                  name="remainingBalance"
                  placeholder="Enter remaining balance"
                  value={formData.remainingBalance}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              {editData ? "Update Loan Customer" : "Add Loan Customer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loan_List_Details;
