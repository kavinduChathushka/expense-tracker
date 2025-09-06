const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const Expense = require('../models/ExpenseFirebase');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  }
});

// (Removed OCR helpers and extract endpoint)

// Get all expenses with filtering
router.get('/', async (req, res) => {
  try {
    const { month, category, startDate, endDate } = req.query;
    let filter = {};

    if (month) {
      filter.month = month;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(filter);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    const { month } = req.query;
    const currentMonth = month || moment().format('YYYY-MM');
    
    const dashboardData = await Expense.getDashboardSummary(currentMonth);
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new expense with file upload
router.post('/', upload.single('payslip'), async (req, res) => {
  try {
    console.log('📤 Expense upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File present' : 'No file');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ message: 'Payslip file is required' });
    }

    const { title, amount, date, category, note } = req.body;
    
    // Validate required fields
    if (!title || !amount || !date || !category) {
      console.log('❌ Missing required fields:', { title: !!title, amount: !!amount, date: !!date, category: !!category });
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Generate month from date
    const month = moment(date).format('YYYY-MM');
    
    // Create file path for database
    const filePath = `/uploads/${req.file.filename}`;

    const expenseData = {
      title,
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      note,
      month,
      filePath
    };

    console.log('💾 Saving expense to database:', expenseData);
    const savedExpense = await Expense.create(expenseData);
    console.log('✅ Expense saved successfully:', savedExpense.id);
    
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('❌ Error creating expense:', error);
    res.status(500).json({ 
      message: 'Error uploading expense. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, date, category, note } = req.body;
    const month = moment(date).format('YYYY-MM');
    
    const updateData = {
      title,
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      note,
      month
    };

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, updateData);

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Delete file from uploads folder
    if (expense.filePath) {
      const filePath = path.join(__dirname, '..', expense.filePath.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
