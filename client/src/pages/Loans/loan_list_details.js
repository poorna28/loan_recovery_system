import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const Loan_List_Details = ({ editData, setEditData, onSaved }) => {

  const [formData, setFormData] = useState({
    customer_id: "",
    loanAmount: "",
    loanPurpose: "",
    interestRate: "",
    loanTerm: "",
    applicationDate: "",
    statusApproved: "",
    monthlyPayment: "",
    nextPaymentDue: "",
    remainingBalance: "",
  });

  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});

  // Clear errors + populate form whenever editData changes
  useEffect(() => {
    setErrors({});
    if (editData) {
      setFormData({
        customer_id: editData.customerId ?? "",
        loanAmount: editData.loanAmount ?? "",
        loanPurpose: editData.loanPurpose ?? "",
        interestRate: editData.interestRate ?? "",
        loanTerm: editData.loanTerm ?? "",
        applicationDate: editData.applicationDate ?? "",
        statusApproved: editData.statusApproved ?? "",
        monthlyPayment: editData.monthlyPayment ?? "",
        nextPaymentDue: editData.nextPaymentDue ?? "",
        remainingBalance: editData.remainingBalance ?? "",
      });
    } else {
      setFormData({
        customer_id: "",
        loanAmount: "",
        loanPurpose: "",
        interestRate: "",
        loanTerm: "",
        applicationDate: "",
        statusApproved: "",
        monthlyPayment: "",
        nextPaymentDue: "",
        remainingBalance: "",
      });
    }
  }, [editData]);

  useEffect(() => {
    api.get("/customers")
      .then(res => {
        const list = res.data?.customers || res.data?.data || [];
        setCustomers(Array.isArray(list) ? list : []);
      })
      .catch(err => console.error("Failed to fetch customers", err));
  }, []);

  const onChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear individual field error as user types
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer_id) newErrors.customer_id = "Customer is required.";
    if (!formData.loanAmount) newErrors.loanAmount = "Loan amount is required.";
    if (!formData.loanPurpose) newErrors.loanPurpose = "Loan purpose is required.";
    if (!formData.interestRate) newErrors.interestRate = "Interest rate is required.";
    if (!formData.loanTerm) newErrors.loanTerm = "Loan term is required.";
    if (!formData.applicationDate) newErrors.applicationDate = "Application date is required.";
    if (!formData.statusApproved) newErrors.statusApproved = "Status is required.";
    if (!formData.monthlyPayment) newErrors.monthlyPayment = "Monthly payment is required.";
    if (!formData.nextPaymentDue) newErrors.nextPaymentDue = "Next payment due date is required.";
    if (!formData.remainingBalance) newErrors.remainingBalance = "Remaining balance is required.";
    setErrors(newErrors);
    return newErrors;
  };

  const closeModal = () => {
    const modalEl = document.getElementById("addLoanCustomerModal");
    if (modalEl) {
      const modal =
        window.bootstrap.Modal.getInstance(modalEl) ||
        new window.bootstrap.Modal(modalEl);
      modal.hide();
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    // FIX: Convert camelCase formData keys → snake_case so the backend
    // correctly maps all fields. Previously monthlyPayment, nextPaymentDue,
    // remainingBalance etc. were sent as-is → backend ignored them → saved null.
    const payload = {
      customer_id: formData.customer_id,
      loan_amount: formData.loanAmount,
      loan_purpose: formData.loanPurpose,
      interest_rate: formData.interestRate,
      loan_term: formData.loanTerm,
      application_date: formData.applicationDate,
      status_approved: formData.statusApproved,
      monthly_payment: formData.monthlyPayment,
      next_payment_due: formData.nextPaymentDue,
      remaining_balance: formData.remainingBalance,
    };

    let apiCall;
    if (editData) {
      if (!editData.id) {
        toast.error("Missing loan record ID for update.");
        return;
      }
      // Use numeric PK (editData.id), NOT the string loan_id (editData.loanId)
      apiCall = api.put(`/loan_customers/${editData.id}`, payload);
    } else {
      apiCall = api.post("/loan_customers", payload);
    }

    apiCall
      .then(() => {
        toast.success(`Loan customer ${editData ? "updated" : "added"} successfully!`);
        closeModal();
        if (setEditData) setEditData(null);
        if (onSaved) onSaved();
      })
      .catch(err => {
        console.error("Error saving loan customer:", err);
        toast.error("Failed to save loan customer.");
      });
  };

  const handleClose = () => {
    setErrors({});
    if (setEditData) setEditData(null);
  };

  // Only lock truly terminal statuses
  const isStatusLocked =
    editData && ["REJECTED", "ACTIVE"].includes(editData.statusApproved);

  return (
    <div
      className="modal fade"
      id="addLoanCustomerModal"
      aria-labelledby="addLoanCustomerModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered custom-modal-dialog">
        <div className="modal-content elegant-modal shadow-lg border-0">

          <div className="modal-header border-0">
            <h5 className="modal-title" id="addLoanCustomerModalLabel">
              {editData ? "Edit Loan Customer" : "Add Loan Customer"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => { handleClose(); closeModal(); }}
            ></button>
          </div>

          <div className="step-section p-3">
            <div className="row g-3">

              {/* Loan ID — read only display */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Loan ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={editData ? (editData.loanId || "") : "Auto-generated"}
                  readOnly
                />
              </div>

              {/* Customer dropdown — fallback for snake_case or camelCase API keys */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Customer<span className="text-danger">*</span>
                </label>
                <select
                  name="customer_id"
                  className={`form-select ${errors.customer_id ? "is-invalid" : ""}`}
                  value={formData.customer_id || ""}
                  onChange={onChange}
                >
                  <option value="">Select Customer</option>
                  {Array.isArray(customers) &&
                    customers.map(c => {
                      const firstName = c.firstName || c.first_name || "";
                      const lastName = c.lastName || c.last_name || "";
                      const cid = c.customer_id || c.id || "";
                      return (
                        <option key={cid} value={cid}>
                          {firstName} {lastName} ({cid})
                        </option>
                      );
                    })}
                </select>
                {errors.customer_id && (
                  <small className="text-danger">{errors.customer_id}</small>
                )}
              </div>

              {/* Loan Amount */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Loan Amount<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.loanAmount ? "is-invalid" : ""}`}
                  name="loanAmount"
                  placeholder="Enter loan amount"
                  value={formData.loanAmount}
                  onChange={onChange}
                  min="0"
                />
                {errors.loanAmount && (
                  <small className="text-danger">{errors.loanAmount}</small>
                )}
              </div>

              {/* Loan Purpose */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Loan Purpose<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.loanPurpose ? "is-invalid" : ""}`}
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={onChange}
                >
                  <option value="">Select Loan Purpose</option>
                  <option value="Home">Home</option>
                  <option value="Educational">Educational</option>
                  <option value="Gold">Gold</option>
                  <option value="Personal">Personal</option>
                </select>
                {errors.loanPurpose && (
                  <small className="text-danger">{errors.loanPurpose}</small>
                )}
              </div>

              {/* Interest Rate */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Interest Rate<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.interestRate ? "is-invalid" : ""}`}
                  name="interestRate"
                  placeholder="Enter interest rate"
                  value={formData.interestRate}
                  onChange={onChange}
                  min="0"
                  step="0.01"
                />
                {errors.interestRate && (
                  <small className="text-danger">{errors.interestRate}</small>
                )}
              </div>

              {/* Loan Term */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Loan Term (months)<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.loanTerm ? "is-invalid" : ""}`}
                  name="loanTerm"
                  placeholder="Enter loan term"
                  value={formData.loanTerm}
                  onChange={onChange}
                  min="1"
                />
                {errors.loanTerm && (
                  <small className="text-danger">{errors.loanTerm}</small>
                )}
              </div>

              {/* Application Date */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Application Date<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.applicationDate ? "is-invalid" : ""}`}
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={onChange}
                />
                {errors.applicationDate && (
                  <small className="text-danger">{errors.applicationDate}</small>
                )}
              </div>

              {/* Status */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Status<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.statusApproved ? "is-invalid" : ""}`}
                  name="statusApproved"
                  value={formData.statusApproved}
                  onChange={onChange}
                  disabled={isStatusLocked}
                >
                  <option value="">Select Status</option>
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="ACTIVE">ACTIVE</option>
                </select>
                {isStatusLocked && (
                  <small className="text-muted">
                    Status is locked for {editData?.statusApproved} loans.
                  </small>
                )}
                {errors.statusApproved && (
                  <small className="text-danger">{errors.statusApproved}</small>
                )}
              </div>

              {/* Monthly Payment */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Monthly Payment<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.monthlyPayment ? "is-invalid" : ""}`}
                  name="monthlyPayment"
                  placeholder="Enter monthly payment"
                  value={formData.monthlyPayment}
                  onChange={onChange}
                  min="0"
                />
                {errors.monthlyPayment && (
                  <small className="text-danger">{errors.monthlyPayment}</small>
                )}
              </div>

              {/* Next Payment Due */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Next Payment Due<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.nextPaymentDue ? "is-invalid" : ""}`}
                  name="nextPaymentDue"
                  value={formData.nextPaymentDue}
                  onChange={onChange}
                />
                {errors.nextPaymentDue && (
                  <small className="text-danger">{errors.nextPaymentDue}</small>
                )}
              </div>

              {/* Remaining Balance */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Remaining Balance<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.remainingBalance ? "is-invalid" : ""}`}
                  name="remainingBalance"
                  placeholder="Enter remaining balance"
                  value={formData.remainingBalance}
                  onChange={onChange}
                  min="0"
                />
                {errors.remainingBalance && (
                  <small className="text-danger">{errors.remainingBalance}</small>
                )}
              </div>

            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { handleClose(); closeModal(); }}
            >
              Close
            </button>
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