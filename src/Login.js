// src/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import GameCanvas from './GameCanvas';

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
      alert('Please enter your email first.');
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => alert('Password reset email sent!'))
      .catch((err) => alert(err.message));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
  <GameCanvas />
  <div className="login-form">  {/* 👈 change login-box to login-form */}
    <div className="logo-title">☁️ <span className="cloud">CLOUD</span> <span className="notes">NOTES</span></div>
    <h2>Login</h2>
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onKeyDown={handleKeyDown}
    />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleLogin}>Login</button>
        <button className="forgot" onClick={handleForgotPassword}>Forgot Password?</button>
        <p className="signup">Don’t have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
}

export default Login;
