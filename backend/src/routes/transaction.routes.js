const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
router.post('/', transactionController.validateTransaction, transactionController.createTransaction );

router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.put('/:id', transactionController.validateTransaction, transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;