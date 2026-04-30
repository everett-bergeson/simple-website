import { useState } from 'react';
import { API_URL } from '../api';

export default function Login({ setLoggedIn }: { setLoggedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Register User
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Registration failed');
        }
        // Auto sign in after registering
      }

      // Login User (Get Token)
      // OAuth2PasswordRequestForm expects x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', email); // backend uses username for OAuth2 form
      formData.append('password', password);

      const loginRes = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!loginRes.ok) {
         const data = await loginRes.json();
         throw new Error(data.detail || 'Login failed');
      }

      const loginData = await loginRes.json();
      localStorage.setItem('token', loginData.access_token);
      setLoggedIn();

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isRegistering ? 'Create Account' : 'Sign In'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '20px', cursor: 'pointer', color: '#007bff' }} onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Sign in here.' : "Don't have an account? Register here."}
      </p>
    </div>
  );
}
