import React from 'react';

const PaymentView = ({ viewData }) => {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '--';
    return `$${Number(value).toFixed(2)}`;
  };

  return (
    <div
      className="modal fade"
      id="viewPaymentModal"
      tabIndex="-1"
      aria-labelledby="viewPaymentModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id="viewPaymentModalLabel">Payment Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            {viewData ? (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Loan ID</strong></label>
                  <p className="form-control-plaintext">{viewData.loan_id || '--'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Amount Paid</strong></label>
                  <p className="form-control-plaintext">{formatCurrency(viewData.amountPaid)}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Payment Date</strong></label>
                  <p className="form-control-plaintext">{viewData.paymentDate || '--'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Payment Method</strong></label>
                  <p className="form-control-plaintext">{viewData.paymentMethod || '--'}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Principal Component</strong></label>
                  <p className="form-control-plaintext">{formatCurrency(viewData.principalComponent)}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><strong>Interest Component</strong></label>
                  <p className="form-control-plaintext">{formatCurrency(viewData.interestComponent)}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label"><strong>Remaining Balance</strong></label>
                  <p className="form-control-plaintext">{formatCurrency(viewData.remainingBalance)}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No payment data available</p>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentView;
