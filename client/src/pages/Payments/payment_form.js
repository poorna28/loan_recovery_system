import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Payment_Form = ({ onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    method: 'CASH'
  });

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch available loans
  useEffect(() => {
    const fetchLoans = () => {
      api.get('/loan_customers')
        .then(res => {
          const activeLoans = res.data.loan_customers.filter(
            loan => loan.status_approved === 'ACTIVE'
          );
          setLoans(activeLoans);
        })
        .catch(err => {
          console.error('Failed to fetch loans:', err);
          setError('Failed to load loans');
        });
    };

    fetchLoans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (!formData.loanId) {
        throw new Error('Please select a loan');
      }
      if (!formData.amount || Number(formData.amount) <= 0) {
        throw new Error('Please enter a valid payment amount');
      }

      // Make payment request
      const response = await api.post('/payments/make', {
        loanId: Number(formData.loanId),
        amount: Number(formData.amount),
        method: formData.method
      });

      setSuccess('Payment processed successfully!');
      setFormData({
        loanId: '',
        amount: '',
        method: 'CASH'
      });

      // Notify parent component
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="makePaymentModal"
      tabIndex="-1"
      aria-labelledby="makePaymentModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="makePaymentModalLabel">
              Make Payment
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="loanId" className="form-label">
                  Select Loan
                </label>
                <select
                  id="loanId"
                  name="loanId"
                  className="form-control"
                  value={formData.loanId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose a loan --</option>
                  {loans.map(loan => (
                    <option key={loan.id} value={loan.id}>
                      Loan #{loan.loan_id} - Balance: ${loan.remaining_balance || 0}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  className="form-control"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="method" className="form-label">
                  Payment Method
                </label>
                <select
                  id="method"
                  name="method"
                  className="form-control"
                  value={formData.method}
                  onChange={handleChange}
                >
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Check</option>
                  <option value="TRANSFER">Bank Transfer</option>
                  <option value="CARD">Card</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Process Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment_Form;
