import React from 'react';

export const StatCard = ({ label, value, icon: Icon, colorTheme = 'indigo' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className={`stat-icon-wrapper stat-icon-${colorTheme}`}>
        {Icon && <Icon size={26} />}
      </div>
    </div>
  );
};
