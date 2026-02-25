const prisma = require('../../db');

const createTransaction = async (data) => {
    return await prisma.transaction.create({
        data:{
            amount: parseFloat(data.amount),
            type: data.type,
            category: data.category,
             description: data.description || null,
            date: data.date ? new Date(data.date) : new Date(),
            userId: data.userId,
        },
    });
    
}
const getTransactionsByUserId = async (userId, filters={}) => {
    const { type, category, startDate, endDate } = filters;
    const where = { userId };
    if (type) where.type = type;
  if (category) where.category = category;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  
  return await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  });
};

const getTransactionById = async (id) => {
    return await prisma.transaction.findUnique({
        where: { id },
    });
};
const updateTransaction = async (id, data) => {
    return await prisma.transaction.update({
    where: { id },
    data: {
      amount: data.amount !== undefined ? parseFloat(data.amount) : undefined,
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
};

const deleteTransaction = async (id) => {
    return await prisma.transaction.delete({
    where: { id },
  });
};

const getSummary= async (userId) => {
      const transactions = await prisma.transaction.findMany({
    where: { userId },
    select: { amount: true, type: true, category: true },
  });
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
  const balance = totalIncome - totalExpenses;
  const byCategory = {};
  transactions.forEach(t => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = { income: 0, expense: 0 };
    }
    if (t.type === 'INCOME') {
      byCategory[t.category].income += parseFloat(t.amount);
    } else {
      byCategory[t.category].expense += parseFloat(t.amount);
    }
  });
  
  return {
    totalIncome: parseFloat(totalIncome.toFixed(2)),
    totalExpenses: parseFloat(totalExpenses.toFixed(2)),
    balance: parseFloat(balance.toFixed(2)),
    byCategory,
    transactionCount: transactions.length,
  };
};
  
module.exports={
    createTransaction,
    getTransactionsByUserId,    
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getSummary
}