// src/ForgotPassword.js
import React, { useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      alert("Password reset email sent!");
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007BFF' }}>☁️ CLOUD <span style={{ color: '#333' }}>NOTES</span></div>
          <h2 style={{ marginTop: '10px' }}>Reset Password</h2>
        </div>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '6px' }}
        />

        <button
          onClick={handleReset}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginBottom: '10px' }}
        >
          Send Reset Link
        </button>

        <p style={{ textAlign: 'center' }}>
          <a href="/" style={{ color: '#007BFF', textDecoration: 'none' }}>Back to Login</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;