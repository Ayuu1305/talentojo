import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { StarRating } from '../components/StarRating';
import { Table } from '../components/Table';
import { RatingModal } from '../components/RatingModal';
import { Search, MapPin, Star, LayoutGrid, List, Sparkles, Edit3 } from 'lucide-react';

export const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [loading, setLoading] = useState(false);

  // Selected store for RatingModal
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.stores.getAll({
        search,
        sortBy,
        sortOrder,
      });
      if (res.success) {
        setStores(res.stores || []);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const handleOpenRating = (store) => {
    setSelectedStore(store);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    loadStores();
  };

  // Table columns for Table View
  const tableColumns = [
    {
      key: 'name',
      label: 'Store Name',
      sortable: true,
      render: (val) => <span style={{ fontWeight: '600' }}>{val}</span>,
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (val) => (
        <span title={val} style={{ maxWidth: '280px', display: 'inline-block' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'Overall Rating',
      sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <StarRating value={Math.round(row.overallRating || 0)} readonly size={16} />
          <span style={{ fontWeight: '700', color: 'var(--star-gold)' }}>
            {row.overallRating > 0 ? row.overallRating.toFixed(1) : 'No ratings'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({row.totalRatings || 0})
          </span>
        </div>
      ),
    },
    {
      key: 'userRating',
      label: "My Submitted Rating",
      sortable: false,
      render: (_, row) => {
        if (row.hasRated) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="role-pill role-user">
                Rated: {row.userSubmittedRating} ★
              </span>
            </div>
          );
        }
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not rated yet</span>;
      },
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      render: (_, row) => (
        <button
          type="button"
          className={`btn btn-sm ${row.hasRated ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => handleOpenRating(row)}
        >
          {row.hasRated ? (
            <>
              <Edit3 size={14} />
              <span>Modify</span>
            </>
          ) : (
            <>
              <Star size={14} />
              <span>Rate</span>
            </>
          )}
        </button>
      ),
    },
  ];

  const handleTableSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h1 className="page-title">Registered Stores</h1>
          <p className="page-subtitle">
            Explore stores, view community feedback, and submit your personal ratings
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="tabs-container" style={{ margin: 0 }}>
          <button
            type="button"
            className={`tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid Card View"
          >
            <LayoutGrid size={16} />
            <span>Cards</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <List size={16} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Search & Sort Controls Toolbar */}
      <div className="filter-toolbar">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search stores by Name or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Sort by:
          </label>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Store Name</option>
            <option value="address">Address</option>
            <option value="rating">Overall Rating</option>
          </select>

          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="ASC">Ascending (A-Z, Low-High)</option>
            <option value="DESC">Descending (Z-A, High-Low)</option>
          </select>

          {search && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSearch('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              Loading stores...
            </div>
          ) : stores.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                No stores found matching "{search}".
              </p>
            </div>
          ) : (
            <div className="stores-grid">
              {stores.map((store) => (
                <div key={store.id} className="store-card">
                  <div>
                    <div className="store-card-header">
                      <h3 className="store-title">{store.name}</h3>
                    </div>

                    <div className="store-address">
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
                      <span>{store.address}</span>
                    </div>

                    <div style={{ marginTop: '1.25rem' }}>
                      <div className="rating-summary-box">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          OVERALL RATING
                        </span>
                        <div className="rating-badge">
                          <Star size={18} fill="currentColor" />
                          <span>{store.overallRating > 0 ? store.overallRating.toFixed(1) : 'New'}</span>
                          <span className="rating-count">({store.totalRatings} ratings)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* User Rating Status Box */}
                    <div className="user-rating-status" style={{ marginBottom: '1rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Your Rating:</span>
                      {store.hasRated ? (
                        <span className="user-rating-val">
                          {store.userSubmittedRating} / 5 Stars ★
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Not rated yet
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      className={`btn ${store.hasRated ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ width: '100%' }}
                      onClick={() => handleOpenRating(store)}
                    >
                      {store.hasRated ? (
                        <>
                          <Edit3 size={16} />
                          <span>Modify My Rating</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Submit a Rating</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Table
          columns={tableColumns}
          data={stores}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleTableSort}
          emptyMessage={loading ? 'Loading stores...' : `No stores match "${search}".`}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        store={selectedStore}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};
