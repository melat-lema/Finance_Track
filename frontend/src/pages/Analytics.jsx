import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'react-toastify';
import { transactionApi, getCurrentUser } from '../api/financeApi';
import Spinner from '../components/common/Spinner';
import {
  FaCalendarAlt,
  FaChartLine,
  FaChartPie,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaDownload
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState('all');
  const user = getCurrentUser();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const userId = user?.id;
      if (!userId) return;

    const response = await transactionApi.getAll({});

let transactions = [];
if (Array.isArray(response?.transactions)) {
  transactions = response.transactions; 
} else if (Array.isArray(response?.data)) {
  transactions = response.data;
} else if (Array.isArray(response)) {
  transactions = response;
}

setTransactions(transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate = new Date(0); 

    if (dateRange === 'week') {
      startDate = startOfWeek(now);
    } else if (dateRange === 'month') {
      startDate = startOfMonth(now);
    } else if (dateRange === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, dateRange]);


const stats = useMemo(() => {
  const income = filteredTransactions.filter(t => t.type === 'INCOME');
  const expenses = filteredTransactions.filter(t => t.type === 'EXPENSE');
  const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  
  const avgIncome = income.length > 0 ? totalIncome / income.length : 0;
  const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  return {
    totalIncome,
    totalExpenses,
    avgIncome,
    avgExpense,
    incomeCount: income.length,
    expenseCount: expenses.length,
    netIncome: totalIncome - totalExpenses,
  };
}, [filteredTransactions]);

  const monthlyTrendsData = useMemo(() => {
    const months = {};
  
  filteredTransactions.forEach(t => {
    const monthKey = format(new Date(t.date), 'MMM yy');
    if (!months[monthKey]) {
      months[monthKey] = { income: 0, expense: 0 };
    }

    const amount = Number(t.amount);
    if (t.type === 'INCOME') {
      months[monthKey].income += amount;
    } else {
      months[monthKey].expense += amount;
    }
  });

    const sortedMonths = Object.entries(months).sort((a, b) => {
      const dateA = new Date(`01 ${a[0]}`);
      const dateB = new Date(`01 ${b[0]}`);
      return dateA - dateB;
    });

    return {
      labels: sortedMonths.map(m => m[0]),
      datasets: [
        {
          label: 'Income',
          data: sortedMonths.map(m => m[1].income),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Expenses',
          data: sortedMonths.map(m => m[1].expense),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderRadius: 8,
        }
      ]
    };
  }, [filteredTransactions]);

  const categoryDistributionData = useMemo(() => {
    const categories = {};
    
    filteredTransactions.forEach(t => {
    if (!categories[t.category]) {
      categories[t.category] = 0;
    }

    categories[t.category] += Number(t.amount);
  });

    const colors = [
      'rgba(139, 92, 246, 0.8)',   
      'rgba(236, 72, 153, 0.8)',   
      'rgba(59, 130, 246, 0.8)',   
      'rgba(245, 158, 11, 0.8)',   
      'rgba(16, 185, 129, 0.8)',   
      'rgba(239, 68, 68, 0.8)',    
      'rgba(99, 102, 241, 0.8)',   
      'rgba(236, 101, 84, 0.8)',   
    ];

    return {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: colors.slice(0, Object.keys(categories).length),
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 2,
      }]
    };
  }, [filteredTransactions]);

  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const spending = [0, 0, 0, 0, 0, 0, 0];

    filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const dayIndex = getDay(new Date(t.date));
        spending[dayIndex] += Number(t.amount);
      });

    return {
      labels: days,
      datasets: [{
        label: 'Spending',
        data: spending,
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2,
        borderRadius: 8,
      }]
    };
  }, [filteredTransactions]);

 
  const categoryComparisonData = useMemo(() => {
    const categories = {};

    filteredTransactions.forEach(t => {
    if (!categories[t.category]) {
      categories[t.category] = { income: 0, expense: 0 };
    }
   
    const amount = Number(t.amount);
    if (t.type === 'INCOME') {
      categories[t.category].income += amount;
    } else {
      categories[t.category].expense += amount;
    }
  });

    const sortedCategories = Object.entries(categories).sort((a, b) => {
      const totalA = a[1].income + a[1].expense;
      const totalB = b[1].income + b[1].expense;
      return totalB - totalA;
    });

    return {
      labels: sortedCategories.map(c => c[0]),
      datasets: [
        {
          label: 'Income',
          data: sortedCategories.map(c => c[1].income),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
          borderRadius: 8,
        },
        {
          label: 'Expenses',
          data: sortedCategories.map(c => c[1].expense),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderRadius: 8,
        }
      ]
    };
  }, [filteredTransactions]);

  
  const categoryBreakdownData = useMemo(() => {
    const categories = {};

    filteredTransactions.forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = {
          income: 0,
          expense: 0,
          count: 0
        };
      }
    const amount = Number(t.amount);
    if (t.type === 'INCOME') {
      categories[t.category].income += amount;
    } else {
      categories[t.category].expense += amount;
    }
    categories[t.category].count += 1;
  });

    return Object.entries(categories).map(([category, data]) => ({
      category,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
      count: data.count
    })).sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  }, [filteredTransactions]);

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
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(148, 163, 184)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
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
        ticks: {
          color: 'rgb(148, 163, 184)',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(148, 163, 184)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
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
          <h1 className="text-3xl font-bold text-white mb-1">Analytics & Reports</h1>
          <p className="text-slate-400">Comprehensive insights into your financial patterns.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
          
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition">
            <FaDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Total Income</span>
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <FaArrowUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mb-1">
            ${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-500 text-xs">{stats.incomeCount} transactions</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Total Expenses</span>
            <div className="p-2 bg-rose-500/20 rounded-lg">
              <FaArrowDown className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-400 mb-1">
            ${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-500 text-xs">{stats.expenseCount} transactions</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Average Income</span>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FaChartLine className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            ${stats.avgIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-500 text-xs">Per transaction</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Average Expense</span>
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <FaWallet className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-400">
            ${stats.avgExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-500 text-xs">Per transaction</p>
        </motion.div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Monthly Trends</h3>
          <div className="h-64">
            <Bar data={monthlyTrendsData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Category Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={categoryDistributionData} options={pieChartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Day of Week */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Spending by Day of Week</h3>
          <div className="h-64">
            <Bar data={dayOfWeekData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Category Comparison */}
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Category Comparison</h3>
          <div className="h-64">
            <Bar data={categoryComparisonData} options={{...chartOptions, indexAxis: 'y'}} />
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown Table */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="text-left text-sm font-semibold text-slate-400 px-6 py-4 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left text-sm font-semibold text-slate-400 px-6 py-4 uppercase tracking-wider">
                  Income
                </th>
                <th className="text-left text-sm font-semibold text-slate-400 px-6 py-4 uppercase tracking-wider">
                  Expense
                </th>
                <th className="text-left text-sm font-semibold text-slate-400 px-6 py-4 uppercase tracking-wider">
                  Net
                </th>
                <th className="text-right text-sm font-semibold text-slate-400 px-6 py-4 uppercase tracking-wider">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categoryBreakdownData.map((row) => (
                <tr key={row.category} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 text-white font-medium">{row.category}</td>
                  <td className="px-6 py-4 text-emerald-400">
                    ${row.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-rose-400">
                    ${row.expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-4 font-semibold ${row.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {row.net >= 0 ? '+' : ''}${row.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;