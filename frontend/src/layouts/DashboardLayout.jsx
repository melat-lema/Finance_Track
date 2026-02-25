import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaBullseye,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { clearSession, getCurrentUser, forceLogout } from '../api/financeApi';
import { toast } from 'react-toastify';


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/transactions', icon: FaExchangeAlt, label: 'Transactions' },
    { path: '/analytics', icon: FaChartPie, label: 'Analytics' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

const handleLogout = () => {
  clearSession();
  
  toast.success('Logged out successfully');

  forceLogout();
};

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-slate-800/50 backdrop-blur-xl border-r border-white/5
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 cursor-pointer">
  <div className="w-11 h-11 flex items-center justify-center rounded-2xl font-bold text-white text-lg
                  bg-gradient-to-br from-blue-500 to-indigo-600 
                  shadow-lg shadow-blue-500/20">
    FF
  </div>

  <div>
    <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
      FinanceFlow
    </h1>
    <p className="text-xs text-slate-400">Personal Finance</p>
  </div>
</div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>


        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-slate-700/30 rounded-xl p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-slate-400">Premium Member</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

 
      <div className="flex-1 flex flex-col min-w-0">
     
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition"
              >
                <FaBars className="w-6 h-6" />
              </button>
              
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-slate-400 hidden sm:block">Welcome back! Here's your financial overview.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition relative">
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;