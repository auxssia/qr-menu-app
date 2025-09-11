'use client';

import { useState } from 'react';
import { createClient } from '../../lib/supabase/client'; // Use the new client-side utility

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Login failed: ${error.message}`);
      return;
    }
    
    // On successful login, redirect to the main dashboard.
    // Using window.location.href ensures a full page reload,
    // which helps the server recognize the new session immediately.
    window.location.href = '/dashboard'; 
  };

  return (
    <div className="login-page-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Staff Login</h1>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Login</button>
        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}