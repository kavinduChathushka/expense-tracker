import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import config from '../config';

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: moment().format('YYYY-MM-DD'),
    category: '',
    note: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filePreview, setFilePreview] = useState(null);

  const categories = [
    'IT Expenses',
    'Building Expenses',
    'Stationery & Food Expenses',
    'Other Expenses'
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setFilePreview('pdf');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a payslip file' });
      return;
    }

    if (!formData.title || !formData.amount || !formData.category) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const data = new FormData();
      data.append('payslip', selectedFile);
      data.append('title', formData.title);
      data.append('amount', formData.amount);
      data.append('date', formData.date);
      data.append('category', formData.category);
      data.append('note', formData.note);

      await axios.post(`${config.API_BASE_URL}/api/expenses`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Expense uploaded successfully! Redirecting to dashboard...' });
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        date: moment().format('YYYY-MM-DD'),
        category: '',
        note: ''
      });
      setSelectedFile(null);
      setFilePreview(null);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error uploading expense:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error uploading expense. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">
          <span role="img" aria-label="upload" style={{ marginRight: '12px', fontSize: '2rem' }}>📤</span>
          Upload Expense
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginTop: '8px' }}>
          Upload a payslip and enter expense details to track your spending
        </p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`} role="alert">
          <span role="img" aria-label={message.type === 'success' ? 'success' : 'error'} style={{ marginRight: '8px' }}>
            {message.type === 'success' ? '✅' : '❌'}
          </span>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} role="form" aria-label="Expense upload form">
        {/* File Upload */}
        <div className="form-group">
          <label className="form-label">
            <span role="img" aria-label="file" style={{ marginRight: '8px' }}>📄</span>
            Payslip File *
          </label>
          {!selectedFile ? (
            <div 
              className="file-upload" 
              onClick={() => document.getElementById('file-input').click()}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-input').click()}
              aria-label="Click to select a payslip file"
            >
              <div className="upload-icon">📄</div>
              <p style={{ fontSize: '1.125rem', marginBottom: '8px' }}>
                Click to select a file (PDF or Image)
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Supported formats: PDF, JPG, PNG
              </p>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                aria-describedby="file-help"
                className="hidden"
              />
              <div id="file-help" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Maximum file size: 10MB
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <span role="img" aria-label="selected file" style={{ marginRight: '8px' }}>📎</span>
                  Selected: {selectedFile.name}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={removeFile}
                  aria-label="Remove selected file"
                >
                  <span role="img" aria-label="remove" style={{ marginRight: '8px' }}>🗑️</span>
                  Remove
                </button>
              </div>
              
              {filePreview && filePreview !== 'pdf' && (
                <img src={filePreview} alt="Payslip preview" className="file-preview" />
              )}
              
              {filePreview === 'pdf' && (
                <div className="pdf-preview">
                  <p style={{ textAlign: 'center', padding: '2rem' }}>
                    <span role="img" aria-label="PDF document" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📄</span>
                    PDF File Selected: {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            <span role="img" aria-label="title" style={{ marginRight: '8px' }}>📝</span>
            Expense Title *
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter expense title"
            required
            aria-describedby="title-help"
          />
          <div id="title-help" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Give your expense a descriptive name
          </div>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">
            <span role="img" aria-label="amount" style={{ marginRight: '8px' }}>💰</span>
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            className="form-control"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            aria-describedby="amount-help"
          />
          <div id="amount-help" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enter the total amount spent
          </div>
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="date">
            <span role="img" aria-label="date" style={{ marginRight: '8px' }}>📅</span>
            Payment Date *
          </label>
          <input
            type="date"
            id="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            aria-describedby="date-help"
          />
          <div id="date-help" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            When was this expense incurred?
          </div>
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="category">
            <span role="img" aria-label="category" style={{ marginRight: '8px' }}>🏷️</span>
            Category *
          </label>
          <select
            id="category"
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            aria-describedby="category-help"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryIcon(category)} {category}
              </option>
            ))}
          </select>
          <div id="category-help" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Choose the most appropriate category for this expense
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="note">
            <span role="img" aria-label="notes" style={{ marginRight: '8px' }}>📝</span>
            Notes (Optional)
          </label>
          <textarea
            id="note"
            className="form-control"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Add any additional notes about this expense"
            rows="4"
            aria-describedby="note-help"
          />
          <div id="note-help" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Optional details, vendor information, or special notes
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
            aria-describedby="submit-help"
          >
            {loading ? (
              <>
                <span role="img" aria-label="loading" style={{ marginRight: '8px' }}>⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <span role="img" aria-label="upload" style={{ marginRight: '8px' }}>📤</span>
                Upload Expense
              </>
            )}
          </button>
          <div id="submit-help" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
            Click to upload your expense and return to the dashboard
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;
