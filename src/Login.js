// src/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => alert('Password reset email sent!'))
      .catch(err => alert(err.message));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007BFF' }}>☁️ CLOUD <span style={{ color: '#333' }}>NOTES</span></div>
          <h2 style={{ marginTop: '10px' }}>Login</h2>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
        />
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginBottom: '10px' }}
        >
          Login
        </button>

        <p style={{ textAlign: 'right', marginBottom: '10px' }}>
          <button onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', fontSize: '14px' }}>
            Forgot Password?
          </button>
        </p>

        <p style={{ textAlign: 'center' }}>
          Don’t have an account?{' '}
          <a href="/signup" style={{ color: '#007BFF', textDecoration: 'none' }}>Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
