import React, { useState } from 'react';
import axiosInstance, { setAuthToken } from '../../api/axios';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(`Form Data Updated: ${e.target.name} = ${e.target.value}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting registration form:', formData);
        try {
            const response = await axiosInstance.post('/register', formData);
            console.log('Registration response:', response);

            const { access_token, token_type } = response.data;
            localStorage.setItem('access_token', access_token);

            setAuthToken(`${token_type} ${access_token}`);

            setMessage(response.data.message || 'Registration successful!');
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            });
        } catch (error) {
            console.error('Registration error:', error);
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="register-page">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Register;
