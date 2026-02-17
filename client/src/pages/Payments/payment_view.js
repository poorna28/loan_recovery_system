import React from 'react';

const Payment_View = ({ viewData }) => {
  if (!viewData) return null;

  return (
    <div
      className="modal fade"
      id="viewPaymentModal"
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Payment Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <p><strong>Loan ID:</strong> {viewData.loan_id}</p>
            <p><strong>Amount Paid:</strong> {viewData.amountPaid}</p>
            <p><strong>Payment Date:</strong> {viewData.paymentDate}</p>
            <p><strong>Method:</strong> {viewData.paymentMethod}</p>
            <p><strong>Principal:</strong> {viewData.principalComponent}</p>
            <p><strong>Interest:</strong> {viewData.interestComponent}</p>
            <p><strong>Remaining Balance:</strong> {viewData.remainingBalance}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment_View;
