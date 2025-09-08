import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import '../../App.css';
import Layout from '../../components/Layout/Layout';
import Basic_Info_Creation_Modal from './basic_info_creation_modal';

const Basic_Info = () => {
    const [customers, setCustomers] = useState([]);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        api.get('customers')
            .then(res => setCustomers(res.data.customers || []))
            .catch(err => console.error('Failed to fetch customers:', err));
    }, []);


    const handleEdit = (customer) => {
        setEditData(customer);
    }


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
            <button
                type="button"
                className="btn btn-primary mb-3"
                data-bs-toggle="modal"
                data-bs-target="#addCustomerModal"
                onClick={() => setEditData(null)}
            >
                Add Customer
            </button>
            <Basic_Info_Creation_Modal editData={editData} setEditData={setEditData} />

            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">FirstName</th>
                            <th scope="col">Email</th>
                            <th scope="col">PhoneNumber</th>
                            <th scope="col">Date_of_Birth</th>
                            <th scope="col">Address</th>
                            <th scope="col">EmploymentStatus</th>
                            <th scope="col">AnnualIncome</th>
                            <th scope="col">creditScore</th>
                            <th scope="col">Actions</th>


                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, idx) => (
                            <tr key={customer.id}>
                                <td>{customer.firstName}</td>
                                <td>{customer.email}</td>
                                <td>{customer.PhoneNumber}</td>
                                <td>{customer.dateOfBirth}</td>
                                <td>{customer.address}</td>
                                <td>{customer.EmploymentStatus}</td>
                                <td>{customer.AnnualIncome}</td>
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