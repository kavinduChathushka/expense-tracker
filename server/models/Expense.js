const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['IT Expenses', 'Building Expenses', 'Stationery & Food Expenses', 'Other Expenses']
  },
  note: {
    type: String,
    trim: true,
    default: ''
  },
  month: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'actual',
    enum: ['actual', 'upcoming']
  },
  filePath: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
expenseSchema.index({ month: 1, category: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
