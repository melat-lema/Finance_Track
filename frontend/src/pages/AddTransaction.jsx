import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaDollarSign,
  FaTag,
  FaStickyNote,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { transactionApi, getCurrentUser } from '../api/financeApi';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const AddTransaction = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    amount: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  
  const categories = {
    INCOME: ['Salary', 'Freelance', 'Investments', 'Business', 'Gift', 'Other Income'],
    EXPENSE: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Rent', 'Other Expense']
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        description: formData.description.trim() || null,
        date: formData.date,
        userId: user?.id,
      };

      await transactionApi.create(transactionData);

      toast.success('Transaction added successfully! 🎉', {
        position: 'top-right',
        autoClose: 3000,
      });

    
      setTimeout(() => {
        navigate('/transactions');
      }, 500);

    } catch (error) {
      console.error('Failed to add transaction:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add transaction. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Add Transaction</h1>
          <p className="text-slate-400">Record a new income or expense transaction.</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME', category: '' }))}
                  className={`
                    flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200
                    ${formData.type === 'INCOME'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'}
                  `}
                >
                  <FaArrowUp className={`w-5 h-5 ${formData.type === 'INCOME' ? 'text-emerald-400' : ''}`} />
                  <span className="font-semibold">Income</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE', category: '' }))}
                  className={`
                    flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-200
                    ${formData.type === 'EXPENSE'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/20'
                      : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'}
                  `}
                >
                  <FaArrowDown className={`w-5 h-5 ${formData.type === 'EXPENSE' ? 'text-rose-400' : ''}`} />
                  <span className="font-semibold">Expense</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`
                    w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition
                    ${errors.date ? 'border-rose-500' : 'border-white/10'}
                  `}
                />
                <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-rose-400">{errors.date}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`
                    w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white appearance-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition
                    ${errors.category ? 'border-rose-500' : 'border-white/10'}
                    ${!formData.category ? 'text-slate-500' : ''}
                  `}
                >
                  <option value="" disabled>Select a category</option>
                  {categories[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <FaTag className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-rose-400">{errors.category}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Amount
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <FaDollarSign className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={`
                    w-full bg-slate-900/50 border rounded-xl pl-12 pr-4 py-3 text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition
                    ${errors.amount ? 'border-rose-500' : 'border-white/10'}
                  `}
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-rose-400">{errors.amount}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
                <span className="text-slate-500 text-xs ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add a note about this transaction..."
                  className={`
                    w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-white resize-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition
                    ${errors.description ? 'border-rose-500' : 'border-white/10'}
                  `}
                />
                <FaStickyNote className="absolute right-4 top-4 text-slate-500 w-5 h-5 pointer-events-none" />
              </div>
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-sm text-rose-400">{errors.description}</p>
                ) : (
                  <span></span>
                )}
                <span className="text-xs text-slate-500">
                  {formData.description.length}/200
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold
                  transition-all duration-200
                  ${loading
                    ? 'bg-blue-600/50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5'}
                  text-white
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <FaCheck className="w-5 h-5" />
                    Add Transaction
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-sm mb-1">Transaction Type</p>
            <p className={`text-lg font-bold ${formData.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formData.type}
            </p>
          </div>
          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-sm mb-1">Selected Category</p>
            <p className="text-lg font-bold text-white">
              {formData.category || 'None'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTransaction;