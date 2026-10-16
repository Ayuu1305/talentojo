import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { StarRating } from './StarRating';
import { api } from '../services/api';
import { AlertCircle, CheckCircle2, Star } from 'lucide-react';

export const RatingModal = ({ isOpen, onClose, store, onRatingSubmitted }) => {
  const [selectedRating, setSelectedRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isModify = store && store.hasRated;

  useEffect(() => {
    if (store) {
      setSelectedRating(store.userSubmittedRating || 5);
      setError('');
      setSuccess('');
    }
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!store) return;
    setError('');
    setSuccess('');

    if (selectedRating < 1 || selectedRating > 5) {
      setError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.stores.submitRating(store.id, selectedRating);
      setSuccess(res.message || 'Rating submitted successfully!');
      setTimeout(() => {
        setSuccess('');
        onRatingSubmitted && onRatingSubmitted(res);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to submit rating.');
    } finally {
      setLoading(false);
    }
  };

  if (!store) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isModify ? `Modify Rating for ${store.name}` : `Submit Rating for ${store.name}`}
    >
      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        {error && (
          <div className="alert alert-danger" style={{ textAlign: 'left' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ textAlign: 'left' }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <div style={{ margin: '1rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {isModify
              ? `You previously rated this store ${store.userSubmittedRating} star${store.userSubmittedRating > 1 ? 's' : ''}. Select a new rating below:`
              : 'How was your experience with this store? Click a star to rate from 1 to 5.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
            <StarRating
              value={selectedRating}
              onChange={(newRating) => setSelectedRating(newRating)}
              size={34}
            />
          </div>

          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--star-gold)',
              marginTop: '0.5rem',
            }}
          >
            {selectedRating} / 5 Stars
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '1rem 0 0 0', justifyContent: 'center' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : isModify ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
