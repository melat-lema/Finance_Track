import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaPiggyBank,
  FaPlus,
  FaEllipsisH,
  FaExchangeAlt
} from 'react-icons/fa';
import { summaryApi, transactionApi } from '../api/financeApi';
import { getCurrentUser } from '../api/financeApi';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

 const fetchDashboardData = async () => {
  try {
    const user = getCurrentUser();
    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    
    const [summaryRes, transactionsRes] = await Promise.all([
      summaryApi.get(), 
      transactionApi.getAll({})  
    ]);

const summary = summaryRes?.summary || summaryRes?.data || summaryRes || {};
    
    
let transactions = [];

if (Array.isArray(transactionsRes?.transactions)) {
  transactions = transactionsRes.transactions;
} else if (Array.isArray(transactionsRes?.data)) {
  transactions = transactionsRes.data;
} else if (Array.isArray(transactionsRes)) {
  transactions = transactionsRes;
} else {
  console.warn(' Unexpected transactions format:', transactionsRes);
  transactions = [];
}


setSummary(summary);
setRecentTransactions(transactions.slice(0, 5));
  } catch (error) {
    console.error(' Failed to fetch dashboard data:', error);
    toast.error('Failed to load dashboard data. Please try again.');
    setSummary({ totalIncome: 0, totalExpenses: 0, balance: 0, byCategory: {} });
    setRecentTransactions([]);
  } finally {
    setLoading(false);
  }
};

  const incomeExpenseData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [Number(summary?.totalIncome || 0), Number(summary?.totalExpenses || 0)],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', 
          'rgba(239, 68, 68, 0.8)'  
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const categoryData = {
    labels: Object.keys(summary?.byCategory || {}),
    datasets: [
      {
        data: Object.values(summary?.byCategory || {}).map(cat => cat.expense || cat.income || 0),
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)', 
          'rgba(236, 72, 153, 0.8)', 
          'rgba(59, 130, 246, 0.8)', 
          'rgba(245, 158, 11, 0.8)', 
          'rgba(16, 185, 129, 0.8)', 
          'rgba(239, 68, 68, 0.8)',  
        ],
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: 'rgb(148, 163, 184)',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: { color: 'rgb(148, 163, 184)' }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: { color: 'rgb(148, 163, 184)' }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={50} />
      </div>
    );
  }

  const savingsRate = summary?.totalIncome > 0
    ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100).toFixed(1)
    : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your financial overview.</p>
        </div>
        <Link
          to="/transactions/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
        >
          <FaPlus className="w-4 h-4" />
          Add Transaction
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-100 text-sm font-medium">Total Balance</span>
              <div className="p-2 bg-white/10 rounded-lg">
                <FaWallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
             ${Number(summary?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-blue-200 text-sm mt-2">Available funds</p>
          </div>
        </motion.div>

        {/* Total Income */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-100 text-sm font-medium">Total Income</span>
              <div className="p-2 bg-white/10 rounded-lg">
                <FaArrowUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
             ${Number(summary?.totalIncome || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-emerald-200 text-sm mt-2">This period</p>
          </div>
        </motion.div>

        {/* Total Expenses */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-rose-100 text-sm font-medium">Total Expenses</span>
              <div className="p-2 bg-white/10 rounded-lg">
                <FaArrowDown className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">
             ${Number(summary?.totalExpenses || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-rose-200 text-sm mt-2">This period</p>
          </div>
        </motion.div>

        {/* Savings Rate */}
        <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-amber-100 text-sm font-medium">Savings Rate</span>
              <div className="p-2 bg-white/10 rounded-lg">
                <FaPiggyBank className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{savingsRate}%</p>
            <p className="text-amber-200 text-sm mt-2">Great job!</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Income vs Expenses</h3>
          <div className="h-64">
            <Bar data={incomeExpenseData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Category Breakdown</h3>
          <div className="h-64">
            <Pie data={categoryData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <Link to="/transactions" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
                <FaExchangeAlt className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-400">No transactions yet</p>
              <Link to="/transactions/new" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                Add your first transaction
              </Link>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${transaction.type === 'INCOME' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/20 text-rose-400'}
                  `}>
                    {transaction.type === 'INCOME' ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {transaction.description || transaction.category}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {transaction.category} • {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                  </p>
                  <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-600 rounded-lg transition">
                    <FaEllipsisH className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;