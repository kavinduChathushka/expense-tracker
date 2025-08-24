import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const CategoryView = () => {
  const { category } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchCategoryExpenses();
  }, [category, selectedMonth]);

  const fetchCategoryExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/expenses?category=${encodeURIComponent(category)}&month=${selectedMonth}`);
      setExpenses(response.data);
      
      // Calculate total amount for the category in the selected month
      const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error fetching category expenses:', error);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            <Link to="/" className="btn btn-secondary">
              <span role="img" aria-label="back to dashboard" style={{ marginRight: '8px' }}>←</span>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Month Filter */}
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
                onChange={(e) => setSelectedMonth(e.target.value)}
                aria-label="Select month to filter expenses"
              />
            </div>
            <div className="filter-group">
              <div className="stat-item">
                <div className="stat-label">
                  <span role="img" aria-label="total amount" style={{ marginRight: '8px' }}>💰</span>
                  Total in {moment(selectedMonth).format('MMMM YYYY')}
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
            {expenses.length} Expense{expenses.length !== 1 ? 's' : ''} in {moment(selectedMonth).format('MMMM YYYY')}
          </h2>
        </div>

        {expenses.length === 0 ? (
          <div className="empty-state" role="status">
            <h3>No expenses found</h3>
            <p>No expenses found in {category} for {moment(selectedMonth).format('MMMM YYYY')}</p>
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
                      <button
                        className="btn btn-primary"
                        onClick={() => handleViewExpense(expense)}
                        aria-label={`View details for ${expense.title}`}
                      >
                        <span role="img" aria-label="view details" style={{ marginRight: '8px' }}>👁️</span>
                        View Details
                      </button>
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
                        href={selectedExpense.filePath} 
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
                      src={selectedExpense.filePath} 
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
