import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Star, UserPlus, AlertCircle } from 'lucide-react';

export const Register = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validations
  const isNameValid = formData.name.trim().length >= 20 && formData.name.trim().length <= 60;
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim());
  const isPasswordLengthValid = formData.password.length >= 8 && formData.password.length <= 16;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(formData.password);
  const isPasswordValid = isPasswordLengthValid && hasUppercase && hasSpecial;
  const isAddressValid = formData.address.trim().length > 0 && formData.address.trim().length <= 400;

  const isFormValid = isNameValid && isEmailValid && isPasswordValid && isAddressValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isNameValid) {
      setError('Name must be between 20 and 60 characters.');
      return;
    }
    if (!isEmailValid) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!isPasswordValid) {
      setError('Password must be 8-16 characters and contain at least one uppercase letter and one special character.');
      return;
    }
    if (!isAddressValid) {
      setError('Address is required and cannot exceed 400 characters.');
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      navigate('/stores');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <Star size={24} fill="white" />
          </div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">
            Sign up as a normal user to submit and modify store ratings
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              <span>Full Name</span>
              <span className={`form-label-counter ${isNameValid ? 'valid' : formData.name.length > 0 ? 'invalid' : ''}`}>
                {formData.name.trim().length}/60 chars (Min 20 required)
              </span>
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              className={`form-control ${formData.name.length > 0 && !isNameValid ? 'is-invalid' : ''}`}
              placeholder="e.g. Jonathan Alexander Doe"
              value={formData.name}
              onChange={handleChange}
              maxLength={60}
              required
            />
            {formData.name.length > 0 && !isNameValid && (
              <div className="field-error">Name must be between 20 and 60 characters long.</div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              <span>Email Address</span>
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              className={`form-control ${formData.email.length > 0 && !isEmailValid ? 'is-invalid' : ''}`}
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formData.email.length > 0 && !isEmailValid && (
              <div className="field-error">Please enter a valid email address.</div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              <span>Password</span>
              <span className={`form-label-counter ${isPasswordValid ? 'valid' : formData.password.length > 0 ? 'invalid' : ''}`}>
                8-16 characters
              </span>
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              className={`form-control ${formData.password.length > 0 && !isPasswordValid ? 'is-invalid' : ''}`}
              placeholder="e.g. Secret@2026"
              value={formData.password}
              onChange={handleChange}
              maxLength={16}
              required
            />
            <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: isPasswordLengthValid ? 'var(--success)' : 'inherit', marginRight: '0.75rem' }}>
                {isPasswordLengthValid ? '✓' : '•'} 8-16 chars
              </span>
              <span style={{ color: hasUppercase ? 'var(--success)' : 'inherit', marginRight: '0.75rem' }}>
                {hasUppercase ? '✓' : '•'} 1 Uppercase
              </span>
              <span style={{ color: hasSpecial ? 'var(--success)' : 'inherit' }}>
                {hasSpecial ? '✓' : '•'} 1 Special char (!@#$...)
              </span>
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="register-address">
              <span>Residential Address</span>
              <span className={`form-label-counter ${isAddressValid ? 'valid' : ''}`}>
                {formData.address.trim().length}/400 chars
              </span>
            </label>
            <textarea
              id="register-address"
              name="address"
              rows="2"
              className="form-control"
              placeholder="Enter your street address, city, area"
              value={formData.address}
              onChange={handleChange}
              maxLength={400}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={!isFormValid || loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
