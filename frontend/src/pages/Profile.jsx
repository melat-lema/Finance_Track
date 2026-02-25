import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaCalendarAlt,
  FaExchangeAlt,
  FaWallet,
  FaChartLine,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaDownload
} from 'react-icons/fa';
import { getCurrentUser, clearSession, transactionApi, authApi } from '../api/financeApi';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    memberSince: user ? new Date() : new Date()
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user]);

const fetchUserStats = async () => {
  try {
   
    const response = await transactionApi.getAll({});
    const transactions = response.transactions || response.data || [];
    const normalizedTransactions = transactions.map(t => ({
      ...t,
      amount: Number(t.amount),  
    }));

    const income = normalizedTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = normalizedTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    const firstTransactionDate = normalizedTransactions.length > 0
      ? new Date(normalizedTransactions[0].date)
      : new Date();

    setStats({
      totalTransactions: normalizedTransactions.length,
      totalIncome: income,
      totalExpenses: expenses,
      memberSince: firstTransactionDate,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    toast.error('Failed to load profile statistics');
  }
};

const handleUpdateUsername = async () => {
  if (!newUsername.trim() || newUsername.trim().length < 3) {
    toast.error('Username must be at least 3 characters');
    return;
  }
  if (newUsername.trim().length > 30) {
    toast.error('Username must be less than 30 characters');
    return;
  }

  setLoading(true);
  try {

    const response = await authApi.updateUsername(newUsername);
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, username: response.data.username };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast.success('Username updated successfully!');
    setEditing(false);
  window.dispatchEvent(new Event('storage'));
    
  } catch (error) {
    console.error('Failed to update username:', error);
    const message = error.response?.data?.message || 'Failed to update username';
    toast.error(message);
  } finally {
    setLoading(false);
  }
};
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearSession();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    const confirmText = 'DELETE MY ACCOUNT';
    const userInput = window.prompt(
      `Type "${confirmText}" to confirm deletion. This will permanently delete all your transactions and cannot be undone.`
    );

    if (userInput === confirmText) {
      setLoading(true);
      try {
        clearSession();
        toast.success('Account deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete account');
      } finally {
        setLoading(false);
      }
    } else if (userInput !== null) {
      toast.error('Confirmation text does not match');
    }
  };

  const handleExportData = () => {
    toast.info('Export functionality coming soon!');
    
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Profile Settings</h1>
        <p className="text-slate-400">Manage your account and preferences.</p>
      </div>

      {/* Account Information */}
      <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
        
        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Username</label>
            {editing ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  autoFocus
                />
                <button
                  onClick={handleUpdateUsername}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-50"
                >
                  <FaCheck className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNewUsername(user?.username || '');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition"
                >
                  <FaTimes className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{user?.username}</p>
                    <p className="text-slate-500 text-sm">Click edit to change</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-xl">
            <FaCalendarAlt className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-400">Member Since</p>
              <p className="text-white font-medium">
                {format(stats.memberSince, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* User ID */}
          <div className="p-4 bg-slate-900/30 rounded-xl">
            <p className="text-sm text-slate-400 mb-1">User ID</p>
            <p className="text-slate-500 font-mono text-sm break-all">{user?.id}</p>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Your Activity</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/30 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <FaExchangeAlt className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Total Transactions</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
          </div>

          <div className="p-4 bg-slate-900/30 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <FaChartLine className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400 text-sm">Total Income</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              ${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-4 bg-slate-900/30 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <FaWallet className="w-5 h-5 text-rose-400" />
              <span className="text-slate-400 text-sm">Total Expenses</span>
            </div>
            <p className="text-2xl font-bold text-rose-400">
              ${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-br from-rose-900/30 to-orange-900/30 border border-rose-500/30 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-rose-400 mb-2">Danger Zone</h2>
        <p className="text-slate-400 text-sm mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition"
          >
            <FaSignOutAlt className="w-5 h-5" />
            Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTrash className="w-5 h-5" />
            Delete Account
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;