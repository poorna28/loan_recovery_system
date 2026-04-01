import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import '../../App.css';
import Layout from '../../components/Layout/Layout';
import Customer_details from './customer_details';
import Customer_list_view from './customer_list_view';
import { Modal } from "bootstrap";
import { toast } from 'react-toastify';

// const Basic_Info = () => {

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerLoans, setCustomerLoans] = useState([]);


  const openLoansModal = async (customer_id) => {
    setSelectedCustomer(customer_id);

    const res = await api.get(
      `/loan_customers/customer/${customer_id}`
    );

    setCustomerLoans(res.data.loans);

    const modal = new window.bootstrap.Modal(
      document.getElementById('customerLoansModal')
    );
    modal.show();
  };


  useEffect(() => {
    api.get('customers')
      .then(res => setCustomers(res.data.customers || []))
      .catch(err => console.error('Failed to fetch customers:', err));
  }, []);

  // const handleEdit = (customer) => {
  //     setEditData(customer);
  // };



  const handleEdit = (customer) => {
    fetchCustomerById(customer.customer_id);
  };


  const openViewCustomer = async (customer_id) => {
    try {
      const res = await api.get(`/customers/${customer_id}`);
      setViewData(res.data);

      // Open Bootstrap modal manually

    } catch (err) {
      console.error("Error fetching customer:", err);
      toast.error("Failed to load customer details");
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        // console.log(`Deleting: /customers/${id}`);

        setCustomers(prev => prev.filter(c => c.customer_id !== id));
      } catch (err) {
        toast.error("Failed to delete customer");
      }
    }
  };

  const fetchCustomerById = async (customerId) => {
    // console.log(" Calling edit API for:", customerId);

    try {
      const res = await api.get(`/customers/${customerId}`);
      // console.log(" Edit API response:", res.data);

      setEditData(res.data); // THIS fills modal
    } catch (err) {
      console.error(" Edit API error:", err);
    }
  };


  return (
    <Layout>
      {/* Add Button */}
      <button
        type="button"
        className="btn btn-primary d-block mb-3"
        style={{ marginLeft: "auto" }}
        data-bs-toggle="modal"
        data-bs-target="#addCustomerModal"
        onClick={() => setEditData(null)}
      >
        Add Customer
      </button>

      {/* Add/Edit Modal */}
      <Customer_details editData={editData} setEditData={setEditData} />

      {/* View Modal */}
      <Customer_list_view viewData={viewData} />

      {/* Customer Table */}
      <div className="table-responsive customer-table">
        <table className="table table-striped  table-hover align-middle">
          <thead>
            <tr>
              <th>Customer Id</th>
              <th>Full Name</th>
              <th>Phone No</th>
              <th>Email</th>
              <th>Loan Count</th>
              <th>Emp Status</th>
              <th>Profile Status</th>
              <th>Annual Income</th>
              <th>Credit Score</th>
              <th style={{ width: "130px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_id}</td>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.email}</td>
                <td>
                  {customer.loan_count > 0 ? (
                    <button
                      className="btn btn-link p-0"
                      onClick={() => openLoansModal(customer.customer_id)}
                    >
                      {customer.loan_count}
                    </button>
                  ) : (
                    <span>0</span>
                  )}
                </td>
                <td>{customer.employmentStatus}</td>
                <td>{customer.profileStatus}</td>
                <td>{customer.annualIncome}</td>
                <td>{customer.creditScore}</td>
                <td>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(customer)}
                      data-bs-toggle="modal"
                      data-bs-target="#addCustomerModal"
                      title="Edit"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => openViewCustomer(customer.customer_id)}
                      data-bs-toggle="modal"
                      data-bs-target="#viewCustomerModal"
                      title="View"
                    >
                      <i className="bi bi-eye"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(customer.customer_id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="customerLoansModal">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Loans for Customer: {selectedCustomer}
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {customerLoans.length === 0 ? (
                <p>No loans found.</p>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Loan ID</th>
                      <th>Amount</th>
                      <th>Purpose</th>
                      <th>Status</th>
                      <th>Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerLoans.map(l => (
                      <tr key={l.id}>
                        <td>{l.loan_id}</td>
                        <td>{l.loan_amount}</td>
                        <td>{l.loan_purpose}</td>
                        <td>{l.status_approved}</td>
                        <td>{l.loan_term}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
};

// export default Basic_Info;

export default Customers;
