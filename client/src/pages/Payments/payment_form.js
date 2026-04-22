import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { buildUrl, buildPayload } from '../../utils/queryBuilder';

const Payment_Form = ({ onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    amount: '',
    method: 'CASH'
  });

  const [loans, setLoans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loansLoading, setLoansLoading] = useState(true);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch available loans
  useEffect(() => {
    const fetchLoans = () => {
      setLoansLoading(true);
      const loansFilters = { page: 1, limit: 100, status: 'ACTIVE' };
      const url = buildUrl('/loan_customers', loansFilters);
      api.get(url)
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

  // Fetch payment methods from settings
  useEffect(() => {
    const fetchPaymentMethods = () => {
      setMethodsLoading(true);
      api.get('/settings/payment-methods')
        .then(res => {
          console.log("Payment methods response:", res.data);
          // API returns: { success: true, settings: { methods: [...], rules: {...} } }
          // Filter to show only enabled methods
          const enabledMethods = (res.data.settings?.methods || []).filter(
            method => method.is_enabled === true || method.is_enabled === 1
          );
          console.log("Enabled payment methods:", enabledMethods);
          setPaymentMethods(enabledMethods);
          // Set default method to first enabled method
          if (enabledMethods.length > 0 && !formData.method) {
            setFormData(prev => ({
              ...prev,
              method: enabledMethods[0].method_name
            }));
          }
        })
        .catch(err => {
          console.error('Failed to fetch payment methods:', err);
          // Fallback to default methods if API fails
          const defaultMethods = [
            { id: 1, method_name: 'CASH', icon: '💵', is_enabled: true },
            { id: 2, method_name: 'CHECK', icon: '📄', is_enabled: true },
            { id: 3, method_name: 'TRANSFER', icon: '🏦', is_enabled: true },
            { id: 4, method_name: 'CARD', icon: '💳', is_enabled: false }
          ];
          setPaymentMethods(defaultMethods.filter(m => m.is_enabled));
        })
        .finally(() => {
          setMethodsLoading(false);
        });
    };

    fetchPaymentMethods();
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
      // Build consistent payload
      const payload = buildPayload(
        {
          loanId: Number(formData.loanId),
          amount: Number(formData.amount),
          paymentMethod: formData.method,
          timestamp: new Date().toISOString()
        },
        { excludeFields: [] }
      );

      // Make payment request with payload
      const response = await api.post('/payments/make', payload);

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
                  disabled={methodsLoading || paymentMethods.length === 0}
                >
                  <option value="">
                    {methodsLoading ? '⏳ Loading methods...' : paymentMethods.length === 0 ? '❌ No payment methods available' : '💳 Choose method'}
                  </option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.method_name}>
                      {method.icon} {method.description || method.method_name}
                    </option>
                  ))}
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
