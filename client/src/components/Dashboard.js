import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import config from '../config';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchFilteredExpenses();
    }
  }, [startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (selectedMonth) {
        const response = await axios.get(`${config.API_BASE_URL}/api/expenses/dashboard?month=${selectedMonth}`);
        setDashboardData(response.data);
        setFilteredExpenses(response.data.monthlyExpenses);
      } else {
        const respAll = await axios.get(`${config.API_BASE_URL}/api/expenses`);
        const all = respAll.data || [];
        const total = all.reduce((sum, e) => sum + (e.amount || 0), 0);
        const categoryMap = all.reduce((acc, e) => {
          const key = e.category;
          acc[key] = (acc[key] || 0) + (e.amount || 0);
          return acc;
        }, {});
        const categoryExpenses = Object.keys(categoryMap).map(k => ({ _id: k, total: categoryMap[k] }));
        setDashboardData({ currentMonth: 'All', totalAmount: total, categoryExpenses, monthlyExpenses: all });
        setFilteredExpenses(all);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty data to prevent infinite loading
      setDashboardData({
        totalAmount: 0,
        monthlyExpenses: [],
        categoryExpenses: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredExpenses = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/expenses?startDate=${startDate}&endDate=${endDate}`);
      setFilteredExpenses(response.data);
    } catch (error) {
      console.error('Error fetching filtered expenses:', error);
      setFilteredExpenses([]);
    }
  };

  const getCategoryClass = (category) => {
    const categoryMap = {
      'IT Expenses': 'it',
      'Building Expenses': 'building',
      'Stationery & Food Expenses': 'stationery',
      'Other Expenses': 'other'
    };
    return categoryMap[category] || 'other';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'IT Expenses': '💻',
      'Building Expenses': '🏢',
      'Stationery & Food Expenses': '📚',
      'Other Expenses': '📦'
    };
    return iconMap[category] || '📦';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryTotal = (category) => {
    if (!dashboardData?.categoryExpenses) return 0;
    const categoryData = dashboardData.categoryExpenses.find(cat => cat._id === category);
    return categoryData ? categoryData.total : 0;
  };

  const getDisplayedTotal = () => {
    const list = (startDate && endDate) ? filteredExpenses : (dashboardData?.monthlyExpenses || []);
    return list.reduce((sum, e) => sum + (e?.amount || 0), 0);
  };

  const handleDeleteExpense = async (expenseId, expenseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${expenseTitle}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${config.API_BASE_URL}/api/expenses/${expenseId}`);
        // Refresh the data after successful deletion
        fetchDashboardData();
        if (startDate && endDate) {
          fetchFilteredExpenses();
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

































































  // CSV helpers and exporters
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

  const exportMonthlyExpensesCsv = () => {
    const rows = [[
      'Title', 'Amount', 'Category', 'Date', 'Notes', 'Payslip'
    ]];
    (dashboardData?.monthlyExpenses || []).forEach((e) => {
      rows.push([
        escapeCsv(e.title),
        e.amount,
        escapeCsv(e.category),
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
    const fname = `monthly-expenses-${dashboardData?.currentMonth || selectedMonth}.csv`;
    downloadCsv(csv, fname);
  };

  const exportCategorySummaryCsv = () => {
    const rows = [[
      'Category', 'Total Amount'
    ]];
    (dashboardData?.categoryExpenses || []).forEach((c) => {
      rows.push([
        escapeCsv(c._id),
        c.total
      ]);
    });
    // Add shaded header row
    const csv = rows.map((r, i) => {
      if (i === 0) return r.map(cell => `"${cell}"`).join(',');
      return r.join(',');
    }).join('\n');
    const fname = `category-summary-${dashboardData?.currentMonth || selectedMonth}.csv`;
    downloadCsv(csv, fname);
  };


  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <span>Loading dashboard data...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="empty-state" role="status">
        <h3>No data available</h3>
        <p>Start by uploading your first expense!</p>
        <Link to="/upload" className="btn btn-primary">
          <span role="img" aria-label="upload" style={{ marginRight: '8px' }}>📤</span>
          Upload First Expense
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <span role="img" aria-label="dashboard" style={{ marginRight: '12px', fontSize: '2rem' }}>📊</span>
            Expense Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginTop: '8px' }}>
            <span role="img" aria-label="calendar" style={{ marginRight: '8px' }}>📅</span>
            {selectedMonth ? `Current Month: ${moment(selectedMonth).format('MMMM YYYY')}` : 'All Transactions'}
          </p>
        </div>

        {/* Month Filter */}
        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label className="form-label">
                <span role="img" aria-label="calendar" style={{ marginRight: '8px' }}>📅</span>
                Select Month
              </label>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
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
                onChange={(e) => setStartDate(e.target.value)}
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
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="Select end date for expense filtering"
              />
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-label">
              <span role="img" aria-label="total expenses" style={{ marginRight: '8px' }}>💰</span>
              Total Expenses
            </div>
            <div className="stat-value">{formatCurrency(getDisplayedTotal())}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">
              <span role="img" aria-label="transactions" style={{ marginRight: '8px' }}>📋</span>
              Total Transactions
            </div>
            <div className="stat-value">{dashboardData.monthlyExpenses.length}</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span role="img" aria-label="categories" style={{ marginRight: '12px' }}>🏷️</span>
            Expenses by Category
          </h2>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#3b82f6' }} role="img" aria-label="IT expenses">
              {getCategoryIcon('IT Expenses')}
            </div>
            <h3>IT Expenses</h3>
            <div className="amount">{formatCurrency(getCategoryTotal('IT Expenses'))}</div>
            <Link to="/dashboard/IT%20Expenses" className="category-link">
              View Details →
            </Link>
          </div>
          <div className="dashboard-card">
            <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#8b5cf6' }} role="img" aria-label="Building expenses">
              {getCategoryIcon('Building Expenses')}
            </div>
            <h3>Building Expenses</h3>
            <div className="amount">{formatCurrency(getCategoryTotal('Building Expenses'))}</div>
            <Link to="/dashboard/Building%20Expenses" className="category-link">
              View Details →
            </Link>
          </div>
          <div className="dashboard-card">
            <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#10b981' }} role="img" aria-label="Stationery and food expenses">
              {getCategoryIcon('Stationery & Food Expenses')}
            </div>
            <h3>Stationery & Food</h3>
            <div className="amount">{formatCurrency(getCategoryTotal('Stationery & Food Expenses'))}</div>
            <Link to="/dashboard/Stationery%20%26%20Food%20Expenses" className="category-link">
              View Details →
            </Link>
          </div>
          <div className="dashboard-card">
            <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#f59e0b' }} role="img" aria-label="Other expenses">
              {getCategoryIcon('Other Expenses')}
            </div>
            <h3>Other Expenses</h3>
            <div className="amount">{formatCurrency(getCategoryTotal('Other Expenses'))}</div>
            <Link to="/dashboard/Other%20Expenses" className="category-link">
              View Details →
            </Link>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>
              <span role="img" aria-label="expense list" style={{ marginRight: '12px' }}>📋</span>
              {startDate && endDate ? 'Filtered Expenses' : (selectedMonth ? 'Monthly Expenses' : 'All Expenses')}
            </h2>
            {startDate && endDate && (
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                <span role="img" aria-label="date range" style={{ marginRight: '8px' }}>📅</span>
                Showing expenses from {moment(startDate).format('MMM DD, YYYY')} to {moment(endDate).format('MMM DD, YYYY')}
              </p>
            )}
          </div>
          <button
            className="btn btn-secondary"
            onClick={exportMonthlyExpensesCsv}
            aria-label="Export monthly expenses as CSV"
          >
            <span role="img" aria-label="download" style={{ marginRight: '8px' }}>⬇️</span>
            Export Monthly CSV
          </button>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <div className="empty-state" role="status">
            <h3>No expenses found</h3>
            <p>Try adjusting your filters or upload a new expense.</p>
            <Link to="/upload" className="btn btn-primary">
              <span role="img" aria-label="upload" style={{ marginRight: '8px' }}>📤</span>
              Upload New Expense
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="expense-table" role="table" aria-label="Expense details">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Category</th>
                  <th scope="col">Date</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.title}</td>
                    <td style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>
                      {formatCurrency(expense.amount)}
                    </td>
                    <td>
                      <span className={`category-badge ${getCategoryClass(expense.category)}`}>
                        {getCategoryIcon(expense.category)} {expense.category}
                      </span>
                    </td>
                    <td>{moment(expense.date).format('MMM DD, YYYY')}</td>
                    <td>{expense.note || '-'}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteExpense(expense._id, expense.title)}
                        aria-label={`Delete ${expense.title}`}
                        style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                      >
                        <span role="img" aria-label="delete" style={{ marginRight: '4px' }}>🗑️</span>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

