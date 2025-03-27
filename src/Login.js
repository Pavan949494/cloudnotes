// src/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await auth.signOut();
        alert("Please verify your email before logging in.");
        return;
      }

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
      .catch((err) => alert(err.message));
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background animation */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: '#f0f2f5'
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: { enable: true, mode: 'push' },
              onHover: { enable: true, mode: 'repulse' }
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 100, duration: 0.4 }
            }
          },
          particles: {
            color: { value: '#007BFF' },
            links: { enable: true, color: '#007BFF', distance: 150 },
            move: { enable: true, speed: 2 },
            number: { value: 50 },
            size: { value: { min: 1, max: 3 } }
          }
        }}
        style={{
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Login box */}
      <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
          />

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
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
    </div>
  );
}

export default Login;
