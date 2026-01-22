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
                className="btn btn-primary d-block mb-3"
                 style={{marginLeft: "auto"}}
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
            <div className="table-responsive customer-table">
                <table className="table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th>Customer Id</th>
                            <th>Full Name</th>
                            <th>Phone No</th>
                            <th>Email</th>
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
                                <td>{customer.firstName}</td>
                                <td>{customer.phoneNumber}</td>
                                <td>{customer.email}</td>
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
                                            onClick={() => handleView(customer)}
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
        </Layout>
    );
};

export default Basic_Info;
