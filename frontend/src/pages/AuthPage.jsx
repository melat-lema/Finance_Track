import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";

const fadeUp = {
  hidden: { opacity: 0, y: -40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const AuthPage = ({ type }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const isLogin = type === "login";

 const validateForm = () => {
  const newErrors = {};

  if (!isLogin && !formData.username.trim()) {
    newErrors.username = "Username is required for signup";
  } else if (formData.username && formData.username.trim().length < 3) {
    newErrors.username = "Username must be at least 3 characters";
  }

 
  if (!formData.email?.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }


  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
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
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      
      // 🔔 Show loading toast
      const loadingToast = toast.loading(isLogin ? "Signing in..." : "Creating your account...");
      
      const response = await axios.post(`${API_URL}${endpoint}`, {
        
        ...(isLogin && { 
    email: formData.email.trim().toLowerCase(), 
    password: formData.password 
  }),
  // ✅ Signup: username + email + password
  ...(!isLogin && { 
    username: formData.username.trim(),
    email: formData.email.trim().toLowerCase(), 
    password: formData.password 
  }),
});
   
   
      toast.dismiss(loadingToast);
      
        const { token } = response.data;        
  const user = response.data.data;          
  
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
    
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
   
      toast.success(
        isLogin 
          ? `Welcome back, ${user.username}! 🎉` 
          : `Account created successfully! Welcome, ${user.username}! 🎉`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      
    
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (error) {
      console.error('Auth error:', error);
      
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
       
        const errors = error.response.data.errors;
        errorMessage = errors.map(e => e.message).join(', ');
      } else if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0b1120] flex items-center justify-center px-4 py-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-md p-8 md:p-10 shadow-2xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-xl text-xl font-bold">
            ₹
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-gray-400 text-center mt-2 mb-8">
          {isLogin
            ? "Sign in to your FinanceFlow account"
            : "Start managing your finances today"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
        
          <div>
            <label htmlFor="username" className="block text-sm mb-2 text-gray-300">
              Username
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <FaUser className="w-4 h-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="yourusername"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                required={!isLogin} 
                className={`
                  w-full bg-[#0f172a] border rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                  disabled:opacity-50
                  ${errors.username ? 'border-rose-500' : 'border-white/10'}
                `}
              />
            </div>
            <AnimatePresence>
              {errors.username && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-rose-400"
                >
                  {errors.username}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          )}

          {/* Email Field (Signup Only) */}
          
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required 
                  className={`
                    w-full bg-[#0f172a] border rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    disabled:opacity-50
                    ${errors.email ? 'border-rose-500' : 'border-white/10'}
                  `}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-rose-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <FaLock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`
                  w-full bg-[#0f172a] border rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                  disabled:opacity-50
                  ${errors.password ? 'border-rose-500' : 'border-white/10'}
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-rose-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
            {!isLogin && !errors.password && (
              <p className="text-xs text-gray-500 mt-1">
                At least 6 characters required
              </p>
            )}
          </div>

          {/* Forgot Password (Login Only) */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => toast.info('Password reset coming soon!')}
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl text-white font-semibold
              disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]
              flex items-center justify-center gap-2
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        {/* Switch between Login/Signup */}
        <p className="text-gray-400 text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            to={isLogin ? "/signup" : "/login"}
            className="text-blue-500 hover:text-blue-400 hover:underline font-medium"
          >
            {isLogin ? "Create one" : "Sign in"}
          </Link>
        </p>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-400 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;