import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Payment_Form = ({ onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    method: 'CASH'
  });

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loansLoading, setLoansLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch available loans
  useEffect(() => {
    const fetchLoans = () => {
      setLoansLoading(true);
      api.get('/loan_customers')
        .then(res => {
          console.log("Raw loan_customers response:", res.data);
          const activeLoans = (res.data.loan_customers || []).filter(
            loan => loan.status_approved === 'ACTIVE'
          );
          console.log("Filtered active loans:", activeLoans);
          setLoans(activeLoans);
        })
        .catch(err => {
          console.error('Failed to fetch loans:', err);
          setError('Failed to load loans. Please try again.');
          setLoans([]);
        })
        .finally(() => {
          setLoansLoading(false);
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

    // Validate form before sending
    const validationErrors = [];
    if (!formData.loanId) {
      validationErrors.push('Please select a loan');
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      validationErrors.push('Please enter a valid payment amount');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
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
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
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
              💳 Make Payment
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
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Success!</strong> {success}
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="loanId" className="form-label">
                  Select Loan <span className="text-danger">*</span>
                </label>
                <select
                  id="loanId"
                  name="loanId"
                  className="form-select"
                  value={formData.loanId}
                  onChange={handleChange}
                  disabled={loansLoading || loans.length === 0}
                  required
                >
                  <option value="">
                    {loansLoading ? '⏳ Loading loans...' : loans.length === 0 ? '❌ No active loans' : '📋 Choose a loan'}
                  </option>
                  {loans.map(loan => (
                    <option key={loan.id} value={loan.id}>
                      Loan #{loan.loan_id} - Balance: ₹{Number(loan.remaining_balance || 0).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Payment Amount (₹) <span className="text-danger">*</span>
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

              <div className="mb-4">
                <label htmlFor="method" className="form-label">
                  Payment Method
                </label>
                <select
                  id="method"
                  name="method"
                  className="form-select"
                  value={formData.method}
                  onChange={handleChange}
                >
                  <option value="CASH">💵 Cash</option>
                  <option value="CHECK">📄 Check</option>
                  <option value="TRANSFER">🏦 Bank Transfer</option>
                  <option value="CARD">💳 Card</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading || loansLoading}
              >
                {loading ? '⏳ Processing...' : '✓ Process Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment_Form;
