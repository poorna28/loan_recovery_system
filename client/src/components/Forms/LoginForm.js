import { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/login', form);
    toast.success(res.data.message);

    // ✅ Store token
    localStorage.setItem('authToken', res.data.token || 'logged-in');

    // ✅ Navigate and replace history
    navigate('/dashboard', { replace: true });
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
