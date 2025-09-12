import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import '../../App.css';
import Layout from '../../components/Layout/Layout';
import Customer_list_personal_details from './customer_list_personal_details';
import Customer_list_view from './customer_list_view';

const Basic_Info = () => {
    const [customers, setCustomers] = useState([]);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);

    useEffect(() => {
        api.get('customers')
            .then(res => setCustomers(res.data.customers || []))
            .catch(err => console.error('Failed to fetch customers:', err));
    }, []);

    const handleEdit = (customer) => {
        setEditData(customer);
    };

    const handleView = (customer) => {
        setViewData(customer);
        console.log("Viewing customer:", customer);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await api.delete(`/customers/${id}`);
                console.log(`Deleting: /customers/${id}`);

                setCustomers(prev => prev.filter(c => c.customer_id !== id));
            } catch (err) {
                alert('Failed to delete customer');
            }
        }
    };

    return (
        <Layout>
            {/* Add Button */}
            <button
                type="button"
                className="btn btn-primary mb-3"
                data-bs-toggle="modal"
                data-bs-target="#addCustomerModal"
                onClick={() => setEditData(null)}
            >
                Add Customer
            </button>

            {/* Add/Edit Modal */}
            <Customer_list_personal_details editData={editData} setEditData={setEditData} />

            {/* View Modal */}
            <Customer_list_view viewData={viewData} />

            {/* Customer Table */}
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Customer_Id</th>
                            <th scope="col">Full_Name</th>
                            <th scope="col">Phone_Number</th>
                            <th scope="col">Email</th>
                            <th scope="col">Status</th>
                            <th scope="col">Active_Loans</th>
                            <th scope="col">Last_Payment</th>
                            <th scope="col">Credit_Score</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.customer_id}>
                                <td>{customer.customer_id}</td>
                                <td>{customer.firstName}</td>
                                <td>{customer.phoneNumber}</td>
                                <td>{customer.email}</td>
                                <td>{customer.employmentStatus}</td>
                                <td>{customer.activeLoans}</td>
                                <td>{customer.lastPayment}</td>
                                <td>{customer.creditScore}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(customer)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#addCustomerModal"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-info me-2"
                                        onClick={() => handleView(customer)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#viewCustomerModal"
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(customer.customer_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Basic_Info;
