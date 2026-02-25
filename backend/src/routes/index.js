const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.route');
const transactionRoute = require('./transaction.routes');
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use('/api/auth', authRoutes);
router.use('/api/transactions', authMiddleware, transactionRoute);
router.get('/api/summary', authMiddleware, transactionController.getSummary);

module.exports = router;