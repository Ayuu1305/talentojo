import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const Table = ({
  columns = [],
  data = [],
  sortBy,
  sortOrder = 'ASC',
  onSort,
  emptyMessage = 'No records found.',
}) => {
  const handleHeaderClick = (col) => {
    if (!col.sortable || !onSort) return;
    const isCurrentSort = sortBy === col.key;
    const newOrder = isCurrentSort && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(col.key, newOrder);
  };

  const renderSortIndicator = (col) => {
    if (!col.sortable) return null;
    if (sortBy === col.key) {
      return sortOrder === 'ASC' ? (
        <ArrowUp size={14} className="sort-icon active" style={{ color: 'var(--primary)', opacity: 1 }} />
      ) : (
        <ArrowDown size={14} className="sort-icon active" style={{ color: 'var(--primary)', opacity: 1 }} />
      );
    }
    return <ArrowUpDown size={13} className="sort-icon" />;
  };

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => handleHeaderClick(col)}
                style={col.width ? { width: col.width } : {}}
              >
                <span className="th-content">
                  {col.label}
                  {renderSortIndicator(col)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-table-state">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
