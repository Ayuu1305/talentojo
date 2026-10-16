import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Table } from '../components/Table';
import { StarRating } from '../components/StarRating';
import { Store, Star, Users, MapPin, Mail, RefreshCw, AlertCircle } from 'lucide-react';

export const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.owner.getDashboard({ sortBy, sortOrder });
      if (res.success) {
        setDashboardData(res);
      } else {
        setError(res.message || 'Failed to load dashboard.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const columns = [
    {
      key: 'userName',
      label: 'Customer Name',
      sortable: true,
      render: (val) => <span style={{ fontWeight: '600' }}>{val}</span>,
    },
    {
      key: 'userEmail',
      label: 'Customer Email',
      sortable: true,
    },
    {
      key: 'rating',
      label: 'Submitted Rating',
      sortable: true,
      render: (val) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRating value={val} readonly size={16} />
          <span style={{ fontWeight: '700', color: 'var(--star-gold)' }}>
            {val} / 5
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date Submitted',
      sortable: true,
      render: (val) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {new Date(val).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
  ];

  if (loading && !dashboardData) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
        Loading store dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.hasStore) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '3rem' }}>
        <Store size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h2>No Store Assigned</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Your Store Owner account has not been linked to a store yet. Please contact the System Administrator to link your store.
        </p>
      </div>
    );
  }

  const { store, averageRating, totalRatings, ratingUsers } = dashboardData;

  return (
    <div>
      {/* Header & Refresh */}
      <div className="section-header">
        <div>
          <h1 className="page-title">Store Owner Portal</h1>
          <p className="page-subtitle">
            Monitor customer reviews and performance metrics for your store
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadDashboard}
          title="Refresh Data"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Hero Store & Average Rating Banner */}
      <div className="owner-hero-card">
        <div className="owner-store-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="role-pill role-store_owner">Store Profile</span>
          </div>
          <h2>{store.name}</h2>
          <div className="owner-store-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={16} /> {store.address}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={16} /> {store.email}
            </span>
          </div>
        </div>

        <div className="owner-rating-hero">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            AVERAGE STORE RATING
          </span>
          <div className="owner-rating-num">
            {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
          </div>
          <div style={{ margin: '0.35rem 0' }}>
            <StarRating value={Math.round(averageRating)} readonly size={22} />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Based on {totalRatings} customer rating{totalRatings === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Customer Ratings List Section */}
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Customer Ratings & Feedback</h2>
          <p className="page-subtitle">
            List of registered users who rated your store
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        data={ratingUsers}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        emptyMessage="No customer ratings submitted yet for this store."
      />
    </div>
  );
};
