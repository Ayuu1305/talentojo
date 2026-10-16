import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../context/AuthContext';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password rules checks
  const isLengthValid = newPassword.length >= 8 && newPassword.length <= 16;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword);
  const isMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isFormValid = isLengthValid && hasUppercase && hasSpecial && isMatch && currentPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLengthValid) {
      setError('New password must be between 8 and 16 characters long.');
      return;
    }
    if (!hasUppercase) {
      setError('New password must contain at least one uppercase letter.');
      return;
    }
    if (!hasSpecial) {
      setError('New password must contain at least one special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await updatePassword(currentPassword, newPassword);
      setSuccess(res.message || 'Password updated successfully!');
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
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

        <div className="form-group">
          <label className="form-label" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter 8-16 character new password"
            required
          />

          <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isLengthValid ? 'var(--success)' : 'inherit' }}>
              <span style={{ fontWeight: 'bold' }}>{isLengthValid ? '✓' : '•'}</span> 8 - 16 characters
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: hasUppercase ? 'var(--success)' : 'inherit' }}>
              <span style={{ fontWeight: 'bold' }}>{hasUppercase ? '✓' : '•'}</span> At least one uppercase letter (A-Z)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: hasSpecial ? 'var(--success)' : 'inherit' }}>
              <span style={{ fontWeight: 'bold' }}>{hasSpecial ? '✓' : '•'}</span> At least one special character (!@#$%^&*...)
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />
          {confirmPassword && !isMatch && (
            <div className="field-error">Passwords do not match</div>
          )}
        </div>

        <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!isFormValid || loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
