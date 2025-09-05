import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import config from '../config';

const CategoryView = () => {
  const { category } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchCategoryExpenses();
  }, [category, selectedMonth]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchCategoryExpenses();
    }
  }, [startDate, endDate]);

  const fetchCategoryExpenses = async () => {
    try {
      setLoading(true);
      let url = `${config.API_BASE_URL}/api/expenses?category=${encodeURIComponent(category)}`;
      
      // Add date range parameters if both start and end dates are provided
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      } else if (selectedMonth) {
        url += `&month=${selectedMonth}`;
      }
      
      const response = await axios.get(url);
      setExpenses(response.data);
      
      // Calculate total amount for the category
      const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error fetching category expenses:', error);
      setExpenses([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedExpense(null);
  };

  const handleDeleteExpense = async (expenseId, expenseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${expenseTitle}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${config.API_BASE_URL}/api/expenses/${expenseId}`);
        // Refresh the data after successful deletion
        fetchCategoryExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryClass = (categoryName) => {
    const categoryMap = {
      'IT Expenses': 'it',
      'Building Expenses': 'building',
      'Stationery & Food Expenses': 'stationery',
      'Other Expenses': 'other'
    };
    return categoryMap[categoryName] || 'other';
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'IT Expenses': '💻',
      'Building Expenses': '🏢',
      'Stationery & Food Expenses': '📚',
      'Other Expenses': '📦'
    };
    return iconMap[categoryName] || '📦';
  };

  const getFileExtension = (filePath) => {
    if (!filePath) return '';
    return filePath.split('.').pop().toLowerCase();
  };

  // CSV export for this category's expenses in the selected month
  const escapeCsv = (value) => {
    if (value === null || value === undefined) return '';
    const s = String(value);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };

  const downloadCsv = (csvString, filename) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCategoryExpensesCsv = () => {
    const rows = [[
      'Title', 'Amount', 'Date', 'Notes', 'Payslip'
    ]];
    expenses.forEach((e) => {
      rows.push([
        escapeCsv(e.title),
        e.amount,
        moment(e.date).format('YYYY-MM-DD'),
        escapeCsv(e.note || ''),
        e.filePath ? `${config.API_BASE_URL}${e.filePath}` : ''
      ]);
    });
    // Add shaded header row
    const csv = rows.map((r, i) => {
      if (i === 0) return r.map(cell => `"${cell}"`).join(',');
      return r.join(',');
    }).join('\n');
    let fname = `${category}-expenses`;
    if (startDate && endDate) {
      fname += `-${moment(startDate).format('YYYY-MM-DD')}-to-${moment(endDate).format('YYYY-MM-DD')}`;
    } else if (selectedMonth) {
      fname += `-${selectedMonth}`;
    } else {
      fname += '-all';
    }
    fname += '.csv';
    downloadCsv(csv, fname);
  };

  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <span>Loading {category} expenses...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <h1 className="card-title">
                <span role="img" aria-label={category.toLowerCase()} style={{ marginRight: '12px', fontSize: '2rem' }}>
                  {getCategoryIcon(category)}
                </span>
                {category}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginTop: '8px' }}>
                View all expenses in this category
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={exportCategoryExpensesCsv}
                aria-label={`Export ${category} expenses as CSV`}
              >
                <span role="img" aria-label="download" style={{ marginRight: '8px' }}>⬇️</span>
                Export CSV
              </button>
              <Link to="/" className="btn btn-secondary">
                <span role="img" aria-label="back to dashboard" style={{ marginRight: '8px' }}>←</span>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Month and Date Range Filter */}
        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label className="form-label">
                <span role="img" aria-label="calendar" style={{ marginRight: '8px' }}>📅</span>
                Filter by Month
              </label>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  // Clear date range when month is selected
                  setStartDate('');
                  setEndDate('');
                }}
                placeholder=""
                aria-label="Select month to filter expenses (leave empty to view all)"
              />
            </div>
            <div className="filter-group">
              <label className="form-label">
                <span role="img" aria-label="start date" style={{ marginRight: '8px' }}>📅</span>
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  // Clear month when date range is selected
                  setSelectedMonth('');
                }}
                aria-label="Select start date for expense filtering"
              />
            </div>
            <div className="filter-group">
              <label className="form-label">
                <span role="img" aria-label="end date" style={{ marginRight: '8px' }}>📅</span>
                End Date
              </label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  // Clear month when date range is selected
                  setSelectedMonth('');
                }}
                aria-label="Select end date for expense filtering"
              />
            </div>
            <div className="filter-group">
              <div className="stat-item">
                <div className="stat-label">
                  <span role="img" aria-label="total amount" style={{ marginRight: '8px' }}>💰</span>
                  {startDate && endDate 
                    ? `Total (${moment(startDate).format('MMM DD')} - ${moment(endDate).format('MMM DD, YYYY')})`
                    : selectedMonth 
                    ? `Total in ${moment(selectedMonth).format('MMMM YYYY')}` 
                    : 'Total (All Time)'
                  }
                </div>
                <div className="stat-value">{formatCurrency(totalAmount)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span role="img" aria-label="expense list" style={{ marginRight: '12px' }}>📋</span>
            {expenses.length} Expense{expenses.length !== 1 ? 's' : ''} 
            {startDate && endDate 
              ? ` (${moment(startDate).format('MMM DD')} - ${moment(endDate).format('MMM DD, YYYY')})`
              : selectedMonth 
              ? ` in ${moment(selectedMonth).format('MMMM YYYY')}`
              : ' (All Time)'
            }
          </h2>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state" role="status">
            <h3>No expenses found</h3>
            <p>
              No expenses found in {category} 
              {startDate && endDate 
                ? ` from ${moment(startDate).format('MMM DD, YYYY')} to ${moment(endDate).format('MMM DD, YYYY')}`
                : selectedMonth 
                ? ` for ${moment(selectedMonth).format('MMMM YYYY')}`
                : ''
              }
            </p>
            <Link to="/upload" className="btn btn-primary">
              <span role="img" aria-label="upload" style={{ marginRight: '8px' }}>📤</span>
              Upload New Expense
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="expense-table" role="table" aria-label={`${category} expenses`}>
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td style={{ fontWeight: '500' }}>{expense.title}</td>
                    <td style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>
                      {formatCurrency(expense.amount)}
                    </td>
                    <td>{moment(expense.date).format('MMM DD, YYYY')}</td>
                    <td>{expense.note || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleViewExpense(expense)}
                          aria-label={`View details for ${expense.title}`}
                          style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                        >
                          <span role="img" aria-label="view details" style={{ marginRight: '4px' }}>👁️</span>
                          View
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteExpense(expense._id, expense.title)}
                          aria-label={`Delete ${expense.title}`}
                          style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                        >
                          <span role="img" aria-label="delete" style={{ marginRight: '4px' }}>🗑️</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense Detail Modal */}
      {showModal && selectedExpense && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 id="modal-title" className="modal-title">
                <span role="img" aria-label="expense details" style={{ marginRight: '8px' }}>📋</span>
                {selectedExpense.title}
              </h3>
              <button 
                className="modal-close" 
                onClick={closeModal}
                aria-label="Close expense details"
              >
                ×
              </button>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <span role="img" aria-label="amount" style={{ marginRight: '8px' }}>💰</span>
                Amount
              </label>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                {formatCurrency(selectedExpense.amount)}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span role="img" aria-label="category" style={{ marginRight: '8px' }}>🏷️</span>
                Category
              </label>
              <span className={`category-badge ${getCategoryClass(selectedExpense.category)}`}>
                {getCategoryIcon(selectedExpense.category)} {selectedExpense.category}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span role="img" aria-label="date" style={{ marginRight: '8px' }}>📅</span>
                Date
              </label>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
                {moment(selectedExpense.date).format('MMMM DD, YYYY')}
              </p>
            </div>

            {selectedExpense.note && (
              <div className="form-group">
                <label className="form-label">
                  <span role="img" aria-label="notes" style={{ marginRight: '8px' }}>📝</span>
                  Notes
                </label>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {selectedExpense.note}
                </p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <span role="img" aria-label="payslip" style={{ marginRight: '8px' }}>📄</span>
                Payslip
              </label>
              {selectedExpense.filePath && (
                <div>
                  {getFileExtension(selectedExpense.filePath) === 'pdf' ? (
                    <div className="pdf-preview">
                      <p style={{ textAlign: 'center', padding: '2rem' }}>
                        <span role="img" aria-label="PDF document" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📄</span>
                        PDF Document
                      </p>
                      <a 
                        href={`${config.API_BASE_URL}${selectedExpense.filePath}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ display: 'block', textAlign: 'center' }}
                        aria-label="Open PDF document in new tab"
                      >
                        <span role="img" aria-label="open PDF" style={{ marginRight: '8px' }}>🔗</span>
                        View PDF
                      </a>
                    </div>
                  ) : (
                    <img 
                      src={`${config.API_BASE_URL}${selectedExpense.filePath}`} 
                      alt="Payslip document" 
                      className="file-preview"
                      style={{ maxWidth: '100%' }}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <button 
                className="btn btn-secondary" 
                onClick={closeModal}
                aria-label="Close expense details modal"
              >
                <span role="img" aria-label="close" style={{ marginRight: '8px' }}>✕</span>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryView;
