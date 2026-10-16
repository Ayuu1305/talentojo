import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Star, LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'store_owner') {
        navigate('/owner');
      } else {
        navigate('/stores');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Star size={24} fill="white" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access the Store Rating Platform
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            <LogIn size={18} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign up as a Normal User
          </Link>
        </div>

        {/* Quick Demo Credentials */}
        <div className="demo-credentials-box">
          <div className="demo-credentials-title">Quick Demo Login (Click to fill)</div>
          <div className="demo-chip-group">
            <div
              className="demo-chip"
              onClick={() => fillDemoAccount('admin@example.com', 'Admin@1234')}
            >
              <span><strong>System Admin:</strong> admin@example.com</span>
              <span className="role-pill role-admin">Admin</span>
            </div>
            <div
              className="demo-chip"
              onClick={() => fillDemoAccount('owner@example.com', 'Owner@1234')}
            >
              <span><strong>Store Owner:</strong> owner@example.com</span>
              <span className="role-pill role-store_owner">Owner</span>
            </div>
            <div
              className="demo-chip"
              onClick={() => fillDemoAccount('user1@example.com', 'User@1234')}
            >
              <span><strong>Normal User:</strong> user1@example.com</span>
              <span className="role-pill role-user">User</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
