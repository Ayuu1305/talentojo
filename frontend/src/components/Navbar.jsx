import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import { LogOut, KeyRound, Star, Store, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (!user) return null;

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-pill role-admin';
      case 'store_owner':
        return 'role-pill role-store_owner';
      default:
        return 'role-pill role-user';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'store_owner':
        return 'Store Owner';
      default:
        return 'User';
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-icon">
              <Star size={20} fill="white" />
            </div>
            <span>StoreRating</span>
          </div>

          <div className="navbar-user-section">
            <div className="user-badge">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info-text">
                <span className="user-name-label" title={user.name}>
                  {user.name}
                </span>
                <span className={getRoleBadgeClass(user.role)}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPasswordModalOpen(true)}
              title="Change Password"
            >
              <KeyRound size={15} />
              <span>Password</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={logout}
              title="Log out"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
