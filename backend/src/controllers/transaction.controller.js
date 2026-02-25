const transactionService = require('../services/transaction.service');
const { transactionSchema, validate } = require('../validators/schema');
const prisma = require('../../db');
const createTransaction = async (req, res, next) => {
  try {
const userId = req.user.userId;
const { amount, type, category, description, date } = req.validatedData;
const transaction = await transactionService.createTransaction({
      amount,
      type,
      category,
      description: description?.trim() || null,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      userId, 
    });
    
    res.status(201).json({ 
      status: 'success', 
       transaction 
    });
  } catch (error) {
    if (error.code === 'P2003') { 
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid user reference' 
      });
    }
    next(error);
  }
};
const getTransactions = async (req, res, next) => {
  try {
   
    const userId = req.user.userId;
    const { type, category, startDate, endDate } = req.query;
    
    const transactions = await transactionService.getTransactionsByUserId(userId, {
      type, 
      category, 
      startDate, 
      endDate 
    });
    
    res.json({
      status: 'success',
      count: transactions.length,
       transactions
    });
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const transaction = await transactionService.getTransactionById(id);
    
    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    if (transaction.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }
    
    res.json({
      status: 'success',
       transaction
    });
  } catch (error) {
    next(error);
  }
};
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.validatedData || req.body;
    
   const existing = await prisma.transaction.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
   if (existing.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }
    
 const { userId: _, ...safeUpdates } = updates;
    
    const transaction = await transactionService.updateTransaction(id, {
      ...safeUpdates,
      amount: safeUpdates.amount !== undefined ? parseFloat(safeUpdates.amount) : undefined,
      date: safeUpdates.date ? new Date(safeUpdates.date).toISOString() : undefined,
    });
    
    res.json({
      status: 'success',
       transaction
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
   const existing = await prisma.transaction.findUnique({ where: { id } });
    
    if (!existing) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    
    if (existing.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }
    
    await transactionService.deleteTransaction(id);
    
    res.json({
      status: 'success',
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found'
      });
    }
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    const summary = await transactionService.getSummary(userId);
    
    res.json({
      status: 'success',
       summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  validateTransaction: validate(transactionSchema),
};