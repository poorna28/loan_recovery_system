import '../../App.css';
import Layout from '../../components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Loan_List_Details from './loan_list_details';
import Loan_List_View from './loan_list_view';
import { toast } from 'react-toastify';

const Loan_Details = () => {
  const [loanCustomers, setLoanCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoanCustomer, setEditLoanCustomer] = useState(null);
  const [viewLoanCustomer, setViewLoanCustomer] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    api.get('loan_customers')
      .then(res => {
        const mapped = res.data.loan_customers.map(item => ({
          loan_customer_id: item.id,
          loan_id: item.loan_id,
          // FIX Issue 2 (list nulls): use ?? null so 0 is preserved; shown as "—" in table
          loanAmount: item.loan_amount ?? null,
          loanPurpose: item.loan_purpose ?? null,
          interestRate: item.interest_rate ?? null,
          loanTerm: item.loan_term ?? null,
          applicationDate: item.application_date
            ? item.application_date.substring(0, 10)
            : null,
          statusApproved: item.status_approved ?? null,
          monthlyPayment: item.monthly_payment ?? null,
          nextPaymentDue: item.next_payment_due
            ? item.next_payment_due.substring(0, 10)
            : null,
          remainingBalance: item.remaining_balance ?? null,
        }));

        setLoanCustomers(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch loan customers:', err);
        toast.error('Failed to load loan customers.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchLoanCustomerById = async (id) => {
    try {
      const res = await api.get(`/loan_customers/${id}`);

      // FIX Issue 2 (edit fields missing): API may wrap the object under a key.
      // Support both: { id, loan_id, ... } and { loan_customer: { id, loan_id, ... } }
      const loan = res.data?.loan_customer || res.data;

      setEditLoanCustomer({
        id: loan.id,                          // numeric PK — used in PUT URL
        loanId: loan.loan_id,                 // display-only in readonly field
        loanAmount: loan.loan_amount ?? "",
        loanPurpose: loan.loan_purpose ?? "",
        interestRate: loan.interest_rate ?? "",
        loanTerm: loan.loan_term ?? "",
        applicationDate: loan.application_date
          ? loan.application_date.substring(0, 10)
          : "",
        statusApproved: loan.status_approved ?? "",
        monthlyPayment: loan.monthly_payment ?? "",
        nextPaymentDue: loan.next_payment_due
          ? loan.next_payment_due.substring(0, 10)
          : "",
        remainingBalance: loan.remaining_balance ?? "",
        customerId: loan.customer_id ?? "",
      });
    } catch (err) {
      console.error('Failed to fetch loan customer by ID:', err);
      toast.error('Failed to fetch loan customer details.');
    }
  };

  // FIX Issue 1 (double API + blank screen):
  // Root cause: using data-bs-toggle + data-bs-target on buttons causes Bootstrap
  // to open the modal immediately on click. Simultaneously, setEditLoanCustomer(null)
  // triggers a React re-render which remounts the modal mid-animation → blank screen.
  // Also, onSaved called fetchAll() AND the modal's own hide triggered another state
  // update → two API calls fired back-to-back.
  // Solution: Remove data-bs-* attributes from all buttons. Open modal programmatically
  // AFTER state is set so React re-render is complete before Bootstrap animates.
  const openModal = () => {
    const modalEl = document.getElementById("addLoanCustomerModal");
    if (modalEl) {
      const modal =
        window.bootstrap.Modal.getInstance(modalEl) ||
        new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const handleAddClick = () => {
    setEditLoanCustomer(null);
    // Small timeout ensures React flushes the null state before modal opens
    setTimeout(openModal, 0);
  };

  const handleEditClick = async (loanCustomer) => {
    await fetchLoanCustomerById(loanCustomer.loan_customer_id);
    // Open modal AFTER fetch completes so form is fully populated before display
    openModal();
  };

  const handleView = (loanCustomer) => {
    setViewLoanCustomer(loanCustomer);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan customer?')) {
      try {
        await api.delete(`/loan_customers/${id}`);
        toast.success('Loan customer deleted successfully.');
        fetchAll();
      } catch (err) {
        console.error('Delete failed:', err);
        toast.error('Failed to delete loan customer.');
      }
    }
  };

  return (
    <Layout>
      {/* FIX Issue 1: No data-bs-toggle / data-bs-target — open programmatically */}
      <button
        type="button"
        className="btn btn-primary d-block mb-3"
        style={{ marginLeft: 'auto' }}
        onClick={handleAddClick}
      >
        Add Loan Customer
      </button>

      <Loan_List_Details
        editData={editLoanCustomer}
        setEditData={setEditLoanCustomer}
        onSaved={fetchAll}
      />

      <Loan_List_View
        viewData={viewLoanCustomer}
      />

      <div className="table-responsive customer-table">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Loan Amount</th>
              <th>Loan Purpose</th>
              <th>Interest Rate</th>
              <th>Loan Term</th>
              <th>Application Date</th>
              <th>Status</th>
              <th>Monthly Payment</th>
              <th>Next Payment Due</th>
              <th>Remaining Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  <div className="spinner-border spinner-border-sm me-2" role="status" />
                  Loading...
                </td>
              </tr>
            ) : loanCustomers.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-4 text-muted">
                  No loan customers found.
                </td>
              </tr>
            ) : (
              loanCustomers.map((loanCustomer) => (
                <tr key={loanCustomer.loan_customer_id}>
                  <td>{loanCustomer.loan_id}</td>
                  {/* FIX Issue 2 (list): show "—" for null values from API */}
                  <td>{loanCustomer.loanAmount ?? "—"}</td>
                  <td>{loanCustomer.loanPurpose ?? "—"}</td>
                  <td>{loanCustomer.interestRate ?? "—"}</td>
                  <td>{loanCustomer.loanTerm ?? "—"}</td>
                  <td>{loanCustomer.applicationDate ?? "—"}</td>
                  <td>{loanCustomer.statusApproved ?? "—"}</td>
                  <td>{loanCustomer.monthlyPayment ?? "—"}</td>
                  <td>{loanCustomer.nextPaymentDue ?? "—"}</td>
                  <td>{loanCustomer.remainingBalance ?? "—"}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      {/* FIX Issue 1: programmatic open — no data-bs-toggle */}
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEditClick(loanCustomer)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      {/* View modal is unrelated to the add/edit modal — keep data-bs-* here */}
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleView(loanCustomer)}
                        data-bs-toggle="modal"
                        data-bs-target="#viewLoanCustomerModal"
                        title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(loanCustomer.loan_customer_id)}
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

export default Loan_Details;