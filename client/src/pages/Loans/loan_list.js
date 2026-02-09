import '../../App.css';
import Layout from '../../components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Loan_List_Details from './loan_list_details';
import Loan_List_View from './loan_list_view';

const Loan_Details = () => {
  const [loanCustomers, setLoanCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoanCustomer, setEditLoanCustomer] = useState(null); // this will hold the full object (including id)
  const [viewLoanCustomer, setViewLoanCustomer] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    api.get('loan_customers')
      .then(res => {
        const mapped = res.data.loan_customers.map(item => ({
          loan_customer_id: item.id,
          loan_id: item.loan_id,
          loanAmount: item.loan_amount,
          loanPurpose: item.loan_purpose,
          interestRate: item.interest_rate,
          loanTerm: item.loan_term,
          applicationDate: item.application_date ? item.application_date.substring(0, 10) : null,
          statusApproved: item.status_approved,
          monthlyPayment: item.monthly_payment,
          nextPaymentDue: item.next_payment_due ? item.next_payment_due.substring(0, 10) : null,
          remainingBalance: item.remaining_balance,
        }));

        setLoanCustomers(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch loan customers:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEdit = (loanCustomer) => {
    setEditLoanCustomer(loanCustomer);
  };

  const handleView = (loanCustomer) => {
    setViewLoanCustomer(loanCustomer);
    console.log("Viewing loan customer:", loanCustomer);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan customer?")) {
      try {
        await api.delete(`/loan_customers/${id}`);
        // remove from local list
        setLoanCustomers(prev => prev.filter(lc => lc.loan_customer_id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete loan customer');
      }
    }
  };

  return (
    <Layout>
      <button
        type='button'
        className='btn btn-primary mb-3'
        data-bs-toggle="modal"
        data-bs-target="#addLoanCustomerModal"
        onClick={() => setEditLoanCustomer(null)}
      >
        Add Loan Customer
      </button>

      {/* Pass props for edit modal */}
      <Loan_List_Details
        editData={editLoanCustomer}
        setEditData={setEditLoanCustomer}
        onSaved={() => { fetchAll(); }}
      />

      {/* Pass props for view modal */}
      <Loan_List_View
        viewData={viewLoanCustomer}
      />

      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Loan_Id</th>
              <th>Loan Amount</th>
              <th>Loan Purpose</th>
              <th>Interest Rate</th>
              <th>Loan Term</th>
              <th>Application Date</th>
              <th>Status Approved</th>
              <th>Monthly Payment</th>
              <th>Next Payment Due</th>
              <th>Remaining Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="11">Loading...</td></tr>
            ) : (
              loanCustomers.map((loanCustomer) => (
                <tr key={loanCustomer.loan_customer_id}>
                  <td>{loanCustomer.loan_id}</td>
                  <td>{loanCustomer.loanAmount}</td>
                  <td>{loanCustomer.loanPurpose}</td>
                  <td>{loanCustomer.interestRate}</td>
                  <td>{loanCustomer.loanTerm}</td>
                  <td>{loanCustomer.applicationDate}</td>
                  <td>{loanCustomer.statusApproved}</td>
                  <td>{loanCustomer.monthlyPayment}</td>
                  <td>{loanCustomer.nextPaymentDue}</td>
                  <td>{loanCustomer.remainingBalance}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => { handleEdit(loanCustomer); }}
                        data-bs-toggle="modal"
                        data-bs-target="#addLoanCustomerModal" title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => { handleView(loanCustomer); }}
                        data-bs-toggle="modal"
                        data-bs-target="#viewLoanCustomerModal" title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(loanCustomer.loan_customer_id)} title="Delete"
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

export default Loan_Details;
