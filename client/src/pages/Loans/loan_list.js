import '../../App.css';
import Layout from '../../components/Layout/Layout';
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Loan_List_Details from './loan_list_details';
import Loan_List_View from './loan_list_view';


const Loan_Details = () => {

    const [loanCustomers, setLoanCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editLoanCustomer, setEditLoanCustomer] = useState(null);
    const [viewLoanCustomer, setViewLoanCustomer] = useState(null);
    const [deleteLoanCustomer, setDeleteLoanCustomer] = useState(null);

    useEffect(() => {
        api.get('loan_customers')
            .then(res => {
                const mapped = res.data.loan_customers.map(item => ({
                    loan_customer_id: item.id,
                    loan_id: item.loan_id,
                    loanAmount: item.loan_amount,
                    loanPurpose: item.loan_purpose,
                    interestRate: item.interest_rate,
                    loanTerm: item.loan_term,
                    aplicationDate: item.application_date?.substring(0, 10),
                    statusApproved: item.status_approved,
                    monthlyPayment: item.monthly_payment,
                    nextPaymentDue: item.next_payment_due?.substring(0, 10),
                    remainingBalance: item.remaining_balance,
                }));

                setLoanCustomers(mapped);

                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch loan customers:', err);
                setLoading(false);
            });
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
                console.log(`Deleting: /loan_customers/${id}`);
                setLoanCustomers(prev => prev.filter(lc => lc.loan_customer_id !== id));
            } catch (err) {
                alert('Failed to delete loan customer');
            }
        }
    };

    return (
        <Layout>

            <button type='button'
                className='btn btn-primary mb-3'
                data-bs-toggle="modal"
                data-bs-target="#addLoanCustomerModal"
                onClick={() => setEditLoanCustomer(null)}>
                Add Loan Customer

            </button>
              

              <Loan_List_Details editLoanCustomer={editLoanCustomer} setEditLoanCustomer={setEditLoanCustomer}  />
              
              <Loan_List_View viewLoanCustomer={viewLoanCustomer} setViewLoanCustomer={setViewLoanCustomer}  />



            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Loan_Id</th>
                            <th scope="col">Loan Amount</th>
                            <th scope="col">Loan Purpose</th>
                            <th scope="col">Interest Rate</th>
                            <th scope="col">Loan Term</th>
                            <th scope="col">Application Datee</th>
                            <th scope="col">Status Approved</th>
                            <th scope="col">Monthly Payment</th>
                            <th scope="col">Next Payment Due</th>
                            <th scope="col">Remaining Balance</th>
                            <th scope="col">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="12">Loading...</td>
                            </tr>
                        ) : (
                            loanCustomers.map((loanCustomer) => (
                                <tr key={loanCustomer.loan_customer_id}>
                                    <td>{loanCustomer.loan_id}</td>
                                    <td>{loanCustomer.loanAmount}</td>
                                    <td>{loanCustomer.loanPurpose}</td>
                                    <td>{loanCustomer.interestRate}</td>
                                    <td>{loanCustomer.loanTerm}</td>
                                    <td>{loanCustomer.aplicationDate}</td>
                                    <td>{loanCustomer.statusApproved}</td>
                                    <td>{loanCustomer.monthlyPayment}</td>
                                    <td>{loanCustomer.nextPaymentDue}</td>
                                    <td>{loanCustomer.remainingBalance}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(loanCustomer)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#addLoanCustomerModal"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => handleView(loanCustomer)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#viewLoanCustomerModal"
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(loanCustomer.loan_customer_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>
            <Loan_List_Details editData={editLoanCustomer} />

        </Layout>
    )
}
export default Loan_Details;
