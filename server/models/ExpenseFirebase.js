const { db } = require('../firebase-config');

class ExpenseFirebase {
  constructor(data) {
    this.id = data.id || null;
    this.title = data.title;
    this.amount = data.amount;
    this.date = data.date;
    this.category = data.category;
    this.note = data.note || '';
    this.month = data.month;
    this.type = data.type || 'actual';
    this.filePath = data.filePath;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create a new expense
  static async create(expenseData) {
    try {
      console.log('🔥 Creating expense in Firestore:', expenseData);
      
      const expense = new ExpenseFirebase(expenseData);
      const docRef = await db.collection('expenses').add({
        title: expense.title,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        note: expense.note,
        month: expense.month,
        type: expense.type,
        filePath: expense.filePath,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt
      });
      
      console.log('✅ Expense created in Firestore with ID:', docRef.id);
      return { id: docRef.id, ...expenseData };
    } catch (error) {
      console.error('❌ Firestore error:', error);
      throw new Error(`Failed to create expense: ${error.message}`);
    }
  }

  // Get all expenses with optional filters
  static async find(filter = {}) {
    try {
      let query = db.collection('expenses');

      // Apply filters
      if (filter.month) {
        query = query.where('month', '==', filter.month);
      }

      if (filter.category) {
        query = query.where('category', '==', filter.category);
      }

      if (filter.date) {
        if (filter.date.$gte) {
          query = query.where('date', '>=', filter.date.$gte);
        }
        if (filter.date.$lte) {
          query = query.where('date', '<=', filter.date.$lte);
        }
      }

      const snapshot = await query.get();
      const expenses = [];

      snapshot.forEach(doc => {
        expenses.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort by date descending
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

      return expenses;
    } catch (error) {
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }
  }

  // Get expense by ID
  static async findById(id) {
    try {
      const doc = await db.collection('expenses').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Failed to fetch expense: ${error.message}`);
    }
  }

  // Update expense
  static async findByIdAndUpdate(id, updateData) {
    try {
      const updateObj = {
        ...updateData,
        updatedAt: new Date()
      };

      await db.collection('expenses').doc(id).update(updateObj);
      
      const updatedDoc = await db.collection('expenses').doc(id).get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      throw new Error(`Failed to update expense: ${error.message}`);
    }
  }

  // Delete expense
  static async findByIdAndDelete(id) {
    try {
      await db.collection('expenses').doc(id).delete();
      return { message: 'Expense deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete expense: ${error.message}`);
    }
  }

  // Get dashboard summary (aggregation)
  static async getDashboardSummary(month) {
    try {
      const expenses = await this.find({ month });
      
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      const categoryExpenses = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {});

      const categoryArray = Object.entries(categoryExpenses).map(([category, total]) => ({
        _id: category,
        total: total
      }));

      return {
        currentMonth: month,
        totalAmount,
        categoryExpenses: categoryArray,
        monthlyExpenses: expenses
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard summary: ${error.message}`);
    }
  }
}

module.exports = ExpenseFirebase;
