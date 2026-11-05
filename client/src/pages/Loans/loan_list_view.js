import "../../App.css";
import React, { useEffect, useState } from "react";

const LoanListView = ({ viewData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (viewData) {
      setFormData({
        ...viewData,
        applicationDate: viewData.applicationDate || viewData.applicationDate,
        nextPaymentDue: viewData.nextPaymentDue || viewData.nextPaymentDue,
      });
    } else {
      setFormData({});
    }
  }, [viewData]);

  return (
    <div
      className="modal fade"
      id="viewLoanCustomerModal"
      tabIndex="-1"
      aria-labelledby="viewLoanCustomerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered custom-modal-dialog-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewLoanCustomerModalLabel">View Loan Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="mb-3 col-sm-6">
                <label className="form-label">Loan ID</label>
                <p className="form-control-plaintext">{formData.loan_id || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Loan Amount</label>
                <p className="form-control-plaintext">{formData.loanAmount || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Loan Purpose</label>
                <p className="form-control-plaintext">{formData.loanPurpose || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Interest Rate (%)</label>
                <p className="form-control-plaintext">{formData.interestRate || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Loan Term (Months)</label>
                <p className="form-control-plaintext">{formData.loanTerm || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Application Date</label>
                <p className="form-control-plaintext">{formData.applicationDate || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Status Approved</label>
                <p className="form-control-plaintext">{formData.statusApproved || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Monthly Payment</label>
                <p className="form-control-plaintext">{formData.monthlyPayment || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Next Payment Due</label>
                <p className="form-control-plaintext">{formData.nextPaymentDue || "--"}</p>
              </div>

              <div className="mb-3 col-sm-6">
                <label className="form-label">Remaining Balance</label>
                <p className="form-control-plaintext">{formData.remainingBalance || "--"}</p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanListView;
