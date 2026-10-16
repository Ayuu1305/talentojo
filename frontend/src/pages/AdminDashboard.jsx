import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { Table } from '../components/Table';
import { StarRating } from '../components/StarRating';
import { AddUserModal } from '../components/AddUserModal';
import { AddStoreModal } from '../components/AddStoreModal';
import { Users, Store, Star, Plus, Search, Filter, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  // Active Tab: 'stores' | 'users'
  const [activeTab, setActiveTab] = useState('stores');

  // Stores State
  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'createdAt', sortOrder: 'DESC' });
  const [loadingStores, setLoadingStores] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

  // Users State
  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSort, setUserSort] = useState({ sortBy: 'createdAt', sortOrder: 'DESC' });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Load Dashboard Statistics
  const loadStats = useCallback(async () => {
    try {
      const res = await api.admin.getStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Load Stores List
  const loadStores = useCallback(async () => {
    setLoadingStores(true);
    try {
      const res = await api.admin.getStores({
        ...storeFilters,
        sortBy: storeSort.sortBy,
        sortOrder: storeSort.sortOrder,
      });
      if (res.success) {
        setStores(res.stores || []);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
    } finally {
      setLoadingStores(false);
    }
  }, [storeFilters, storeSort]);

  // Load Users List
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await api.admin.getUsers({
        ...userFilters,
        sortBy: userSort.sortBy,
        sortOrder: userSort.sortOrder,
      });
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [userFilters, userSort]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (activeTab === 'stores') {
      loadStores();
    } else {
      loadUsers();
    }
  }, [activeTab, loadStores, loadUsers]);

  // Handlers for Store Table
  const handleStoreSort = (key, order) => {
    setStoreSort({ sortBy: key, sortOrder: order });
  };

  const handleStoreFilterChange = (field, value) => {
    setStoreFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for User Table
  const handleUserSort = (key, order) => {
    setUserSort({ sortBy: key, sortOrder: order });
  };

  const handleUserFilterChange = (field, value) => {
    setUserFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Column Definitions for Stores Table
  const storeColumns = [
    {
      key: 'name',
      label: 'Store Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: '600' }}>{val}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Owner: {row.ownerName}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
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
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRating value={Math.round(val)} readonly size={16} />
          <span style={{ fontWeight: '700', color: 'var(--star-gold)', fontSize: '0.95rem' }}>
            {val > 0 ? val.toFixed(1) : 'No ratings'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ({row.totalRatings || 0})
          </span>
        </div>
      ),
    },
  ];

  // Column Definitions for Users Table
  const userColumns = [
    {
      key: 'name',
      label: 'Full Name',
      sortable: true,
      render: (val) => <span style={{ fontWeight: '600' }}>{val}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (val) => (
        <span title={val} style={{ maxWidth: '240px', display: 'inline-block' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val) => {
        let badgeClass = 'role-user';
        let label = 'User';
        if (val === 'admin') {
          badgeClass = 'role-admin';
          label = 'Admin';
        } else if (val === 'store_owner') {
          badgeClass = 'role-store_owner';
          label = 'Store Owner';
        }
        return <span className={`role-pill ${badgeClass}`}>{label}</span>;
      },
    },
    {
      key: 'rating',
      label: 'Store Rating',
      sortable: true,
      render: (val, row) => {
        if (row.role !== 'store_owner') {
          return <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>N/A</span>;
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <StarRating value={Math.round(val || 0)} readonly size={16} />
            <span style={{ fontWeight: '700', color: 'var(--star-gold)' }}>
              {val !== null && val > 0 ? `${val.toFixed(1)} ★` : 'No store/ratings'}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Page Title & Refresh */}
      <div className="section-header">
        <div>
          <h1 className="page-title">Administrator Dashboard</h1>
          <p className="page-subtitle">
            Manage registered stores, platform users, and review activity
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            loadStats();
            activeTab === 'stores' ? loadStores() : loadUsers();
          }}
          title="Refresh Data"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          colorTheme="indigo"
        />
        <StatCard
          label="Total Stores"
          value={stats.totalStores}
          icon={Store}
          colorTheme="emerald"
        />
        <StatCard
          label="Submitted Ratings"
          value={stats.totalRatings}
          icon={Star}
          colorTheme="amber"
        />
      </div>

      {/* Tabs Header */}
      <div className="section-header">
        <div className="tabs-container">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            <Store size={18} />
            <span>Stores Management</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>Users Management</span>
          </button>
        </div>

        <div>
          {activeTab === 'stores' ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddStoreOpen(true)}
            >
              <Plus size={18} />
              <span>Add New Store</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddUserOpen(true)}
            >
              <Plus size={18} />
              <span>Add New User</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Stores Management */}
      {activeTab === 'stores' && (
        <div>
          {/* Filters Toolbar */}
          <div className="filter-toolbar">
            <div className="search-input-group">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Filter by Store Name..."
                value={storeFilters.name}
                onChange={(e) => handleStoreFilterChange('name', e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <input
                type="text"
                className="form-control"
                style={{ width: '200px' }}
                placeholder="Filter by Email..."
                value={storeFilters.email}
                onChange={(e) => handleStoreFilterChange('email', e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                style={{ width: '200px' }}
                placeholder="Filter by Address..."
                value={storeFilters.address}
                onChange={(e) => handleStoreFilterChange('address', e.target.value)}
              />
              {(storeFilters.name || storeFilters.email || storeFilters.address) && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setStoreFilters({ name: '', email: '', address: '' })}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Stores Table */}
          <Table
            columns={storeColumns}
            data={stores}
            sortBy={storeSort.sortBy}
            sortOrder={storeSort.sortOrder}
            onSort={handleStoreSort}
            emptyMessage={loadingStores ? 'Loading stores...' : 'No stores match your filters.'}
          />
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div>
          {/* Filters Toolbar */}
          <div className="filter-toolbar">
            <div className="search-input-group">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Filter by User Name..."
                value={userFilters.name}
                onChange={(e) => handleUserFilterChange('name', e.target.value)}
              />
            </div>

            <div className="filter-controls">
              <input
                type="text"
                className="form-control"
                style={{ width: '180px' }}
                placeholder="Filter by Email..."
                value={userFilters.email}
                onChange={(e) => handleUserFilterChange('email', e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                style={{ width: '180px' }}
                placeholder="Filter by Address..."
                value={userFilters.address}
                onChange={(e) => handleUserFilterChange('address', e.target.value)}
              />
              <select
                className="filter-select"
                value={userFilters.role}
                onChange={(e) => handleUserFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
              </select>
              {(userFilters.name || userFilters.email || userFilters.address || userFilters.role) && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setUserFilters({ name: '', email: '', address: '', role: '' })}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          <Table
            columns={userColumns}
            data={users}
            sortBy={userSort.sortBy}
            sortOrder={userSort.sortOrder}
            onSort={handleUserSort}
            emptyMessage={loadingUsers ? 'Loading users...' : 'No users match your filters.'}
          />
        </div>
      )}

      {/* Modals */}
      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onStoreCreated={() => {
          loadStores();
          loadStats();
        }}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserCreated={() => {
          loadUsers();
          loadStats();
        }}
      />
    </div>
  );
};
