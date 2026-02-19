import '../../App.css';
import Layout from '../../components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Payment_View from './payment_view';
import Payment_Form from './payment_form';

const Payment_Page = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPayment, setViewPayment] = useState(null);

  const fetchAll = () => {
    setLoading(true);

    api.get('payments')
      .then(res => {
        const mapped = res.data.payments.map(item => ({
          payment_id: item.id,
          loan_id: item.loan_id,
          amountPaid: item.amount_paid,
          paymentDate: item.payment_date
            ? item.payment_date.substring(0, 10)
            : null,
          paymentMethod: item.payment_method,
          principalComponent: item.principal_component,
          interestComponent: item.interest_component,
          remainingBalance: item.remaining_balance,
        }));

        setPayments(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch payments:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleView = (payment) => {
    setViewPayment(payment);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await api.delete(`/payments/${id}`);
        setPayments(prev => prev.filter(p => p.payment_id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete payment');
      }
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh payments list after successful payment
    fetchAll();
  };

  return (
    <Layout>

      <Payment_Form onPaymentSuccess={handlePaymentSuccess} />

      <Payment_View viewData={viewPayment} />

      <div className='table-responsive customer-table'>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h4>Payment History</h4>
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#makePaymentModal"
          >
            <i className="bi bi-plus-circle"></i> Make Payment
          </button>
        </div>
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Amount Paid</th>
              <th>Payment Date</th>
              <th>Method</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Remaining Balance</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="8">Loading...</td></tr>
            ) : (
              payments.map(payment => (
                <tr key={payment.payment_id}>
                  <td>{payment.loan_id}</td>
                  <td>{payment.amountPaid}</td>
                  <td>{payment.paymentDate}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.principalComponent}</td>
                  <td>{payment.interestComponent}</td>
                  <td>{payment.remainingBalance}</td>

                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">

                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleView(payment)}
                        data-bs-toggle="modal"
                        data-bs-target="#viewPaymentModal"
                        title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(payment.payment_id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </Layout>
  );
};

export default Payment_Page;
