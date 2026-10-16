import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '../services/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const AddStoreModal = ({ isOpen, onClose, onStoreCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch store owners for the dropdown
  useEffect(() => {
    if (isOpen) {
      api.admin.getStoreOwners()
        .then((res) => {
          if (res.success) {
            setStoreOwners(res.owners || []);
          }
        })
        .catch((err) => console.warn('Could not fetch store owners:', err.message));
    }
  }, [isOpen]);

  const isNameValid = formData.name.trim().length > 0 && formData.name.trim().length <= 60;
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim());
  const isAddressValid = formData.address.trim().length > 0 && formData.address.trim().length <= 400;
  const isFormValid = isNameValid && isEmailValid && isAddressValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isFormValid) {
      setError('Please fill in all required fields accurately.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        ownerId: formData.ownerId ? parseInt(formData.ownerId, 10) : null,
      };

      const res = await api.admin.createStore(payload);
      setSuccess(res.message || 'Store created successfully!');
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          address: '',
          ownerId: '',
        });
        setSuccess('');
        onStoreCreated && onStoreCreated();
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      address: '',
      ownerId: '',
    });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Store">
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

        {/* Store Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-store-name">
            <span>Store Name</span>
            <span className={`form-label-counter ${isNameValid ? 'valid' : ''}`}>
              {formData.name.trim().length}/60 chars
            </span>
          </label>
          <input
            id="admin-store-name"
            name="name"
            type="text"
            className="form-control"
            placeholder="e.g. Apex Electronics & Gadgets"
            value={formData.name}
            onChange={handleChange}
            maxLength={60}
            required
          />
        </div>

        {/* Store Email */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-store-email">
            <span>Store Email</span>
          </label>
          <input
            id="admin-store-email"
            name="email"
            type="email"
            className={`form-control ${formData.email.length > 0 && !isEmailValid ? 'is-invalid' : ''}`}
            placeholder="contact@store.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Store Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-store-address">
            <span>Store Address</span>
            <span className={`form-label-counter ${isAddressValid ? 'valid' : ''}`}>
              {formData.address.trim().length}/400 chars
            </span>
          </label>
          <textarea
            id="admin-store-address"
            name="address"
            rows="2"
            className="form-control"
            placeholder="Complete street address, city, area"
            value={formData.address}
            onChange={handleChange}
            maxLength={400}
            required
          />
        </div>

        {/* Assign Store Owner */}
        <div className="form-group">
          <label className="form-label" htmlFor="admin-store-owner">
            <span>Assign Store Owner (Optional)</span>
          </label>
          <select
            id="admin-store-owner"
            name="ownerId"
            className="form-control"
            value={formData.ownerId}
            onChange={handleChange}
          >
            <option value="">-- No Owner Assigned --</option>
            {storeOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          <div className="form-hint">
            Assigning an owner allows them to access their store dashboard and view ratings.
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!isFormValid || loading}>
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
