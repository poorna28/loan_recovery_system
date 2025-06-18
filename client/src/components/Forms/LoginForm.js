import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginForm.css';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));
    if (savedUser?.email === form.email && savedUser?.password === form.password) {
      localStorage.setItem('user', JSON.stringify(savedUser));
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Log InSystssdsemx</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
