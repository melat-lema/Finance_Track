import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
  FaTimes
} from 'react-icons/fa';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { transactionApi, getCurrentUser } from '../api/financeApi';
import Spinner from '../components/common/Spinner';
import ConfirmationModal from '../components/common/ConfirmationModal';
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

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sorting, setSorting] = useState([{ id: 'date', desc: true }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
  isOpen: false,
  transactionId: null
});
  const user = getCurrentUser();


  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
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
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

 const handleDelete = async (id) => {
  setDeleteModal({ isOpen: true, transactionId: id });
};

const confirmDelete = async () => {
  try {
    await transactionApi.delete(deleteModal.transactionId);
    setTransactions(prev => prev.filter(t => t.id !== deleteModal.transactionId));
    toast.success('Transaction deleted successfully');
    setDeleteModal({ isOpen: false, transactionId: null });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    toast.error('Failed to delete transaction');
    setDeleteModal({ isOpen: false, transactionId: null });
  }
};

const closeDeleteModal = () => {
  setDeleteModal({ isOpen: false, transactionId: null });
};

  const clearFilters = () => {
    setGlobalFilter('');
    setTypeFilter('');
    setCategoryFilter('');
    setDateRange({ start: '', end: '' });
  };


  const filteredData = useMemo(() => {
    let data = [...transactions];

    
    if (globalFilter) {
      const search = globalFilter.toLowerCase();
      data = data.filter(t =>
        t.description?.toLowerCase().includes(search) ||
        t.category?.toLowerCase().includes(search)
      );
    }

    if (typeFilter) {
      data = data.filter(t => t.type === typeFilter);
    }


    if (categoryFilter) {
      data = data.filter(t => t.category === categoryFilter);
    }

    if (dateRange.start) {
      data = data.filter(t => new Date(t.date) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      data = data.filter(t => new Date(t.date) <= new Date(dateRange.end));
    }

    data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sorting[0]?.desc ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [transactions, globalFilter, typeFilter, categoryFilter, dateRange, sorting]);

  const columns = useMemo(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => {
        const date = getValue();
        return (
          <div className="flex items-center gap-2 text-slate-300">
            <FaCalendarAlt className="w-4 h-4 text-slate-500" />
            {format(new Date(date), 'MMM d, yyyy')}
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ getValue }) => (
        <div className="font-medium text-white">
          {getValue() || 'No description'}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => (
        <span className="text-slate-400">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => {
        const type = getValue();
        const isIncome = type === 'INCOME';
        return (
          <span className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
            ${isIncome 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}
          `}>
            {isIncome ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ getValue, row }) => {
        const amount = getValue();
        const type = row.original.type;
        const isIncome = type === 'INCOME';
        return (
          <span className={`
            font-bold text-lg
            ${isIncome ? 'text-emerald-400' : 'text-rose-400'}
          `}>
            {isIncome ? '+' : '-'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Link
        to={`/transactions/edit/${row.original.id}`}
        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition"
        title="Edit"
      >
        <FaEdit className="w-4 h-4" />
      </Link>
      <button
        onClick={() => handleDelete(row.original.id)}
        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
        title="Delete"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  ),
},
  ], []);

  
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const hasActiveFilters = globalFilter || typeFilter || categoryFilter || dateRange.start || dateRange.end;

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
          <h1 className="text-3xl font-bold text-white mb-1">Transactions</h1>
          <p className="text-slate-400">Manage and track all your financial transactions.</p>
        </div>
        <Link
          to="/transactions/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
        >
          <FaPlus className="w-4 h-4" />
          Add Transaction
        </Link>
      </div>

      {/* Filters Section */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl p-6">
        {/* Filter Toggle for Mobile */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <FaFilter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Filter Content */}
        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition appearance-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sorting[0]?.desc ? 'date-desc' : 'date-asc'}
              onChange={(e) => setSorting([{ id: 'date', desc: e.target.value === 'date-desc' }])}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition appearance-none cursor-pointer"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High-Low)</option>
              <option value="amount-asc">Amount (Low-High)</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
              />
            </div>
          </div>

          {/* Active Filters Badge */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-slate-400">Active filters:</span>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition"
              >
                <FaTimes className="w-3 h-3" />
                Clear all
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-white/5">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="text-left text-sm font-semibold text-slate-400 px-6 py-4 uppercase tracking-wider"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                        <FaSearch className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-lg font-medium mb-1">No transactions found</p>
                      <p className="text-slate-500 text-sm">
                        {hasActiveFilters 
                          ? 'Try adjusting your filters' 
                          : 'Add your first transaction to get started'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-slate-700/30 transition group"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {table.getRowModel().rows.length > 0 && (
          <div className="border-t border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Items per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                  table.setPageIndex(0);
                }}
                className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {[10, 20, 50, 100].map(pageSize => (
                  <option key={pageSize} value={pageSize}>{pageSize}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft className="w-3 h-3" />
                Previous
              </button>
              
              <span className="text-sm text-slate-400 px-2">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-white">{filteredData.length}</p>
        </div>
        <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Total Income</p>
          <p className="text-2xl font-bold text-emerald-400">
            ${filteredData
              .filter(t => t.type === 'INCOME')
              .reduce((sum, t) => sum + Number(t.amount), 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-rose-400">
            ${filteredData
              .filter(t => t.type === 'EXPENSE')
              .reduce((sum, t) => sum + Number(t.amount), 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>
      {/* Delete Confirmation Modal */}
    <ConfirmationModal
      isOpen={deleteModal.isOpen}
      onClose={closeDeleteModal}
      onConfirm={confirmDelete}
      title="Delete Transaction?"
      message="This action cannot be undone. This will permanently delete the transaction from your records."
      confirmText="Delete"
      cancelText="Cancel"
      type="danger"
    />
    </motion.div>
  );
};

export default Transactions;