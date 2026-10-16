import React, { useState } from 'react';
import { Modal } from './Modal';
import { api } from '../services/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const AddUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validation criteria
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
    setSuccess('');

    if (!isFormValid) {
      setError('Please resolve all validation errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.admin.createUser(formData);
      setSuccess(res.message || 'User created successfully!');
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          password: '',
          address: '',
          role: 'user',
        });
        setSuccess('');
        onUserCreated && onUserCreated();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      address: '',
      role: 'user',
    });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New User">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-user-name">
            <span>Full Name</span>
            <span className={`form-label-counter ${isNameValid ? 'valid' : formData.name.length > 0 ? 'invalid' : ''}`}>
              {formData.name.trim().length}/60 chars (Min 20 required)
            </span>
          </label>
          <input
            id="admin-user-name"
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
          <label className="form-label" htmlFor="admin-user-email">
            <span>Email Address</span>
          </label>
          <input
            id="admin-user-email"
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
          <label className="form-label" htmlFor="admin-user-password">
            <span>Password</span>
            <span className={`form-label-counter ${isPasswordValid ? 'valid' : formData.password.length > 0 ? 'invalid' : ''}`}>
              8-16 characters
            </span>
          </label>
          <input
            id="admin-user-password"
            name="password"
            type="password"
            className={`form-control ${formData.password.length > 0 && !isPasswordValid ? 'is-invalid' : ''}`}
            placeholder="Min 8 chars, 1 uppercase, 1 special char"
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
              {hasUppercase ? '✓' : '•'} 1 Uppercase (A-Z)
            </span>
            <span style={{ color: hasSpecial ? 'var(--success)' : 'inherit' }}>
              {hasSpecial ? '✓' : '•'} 1 Special char
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-user-address">
            <span>Address</span>
            <span className={`form-label-counter ${isAddressValid ? 'valid' : ''}`}>
              {formData.address.trim().length}/400 chars
            </span>
          </label>
          <textarea
            id="admin-user-address"
            name="address"
            rows="2"
            className="form-control"
            placeholder="Street address, city, state, zip"
            value={formData.address}
            onChange={handleChange}
            maxLength={400}
            required
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-user-role">
            <span>User Role</span>
          </label>
          <select
            id="admin-user-role"
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">Normal User</option>
            <option value="admin">System Administrator</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!isFormValid || loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
