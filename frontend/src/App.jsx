import {useState, useEffect} from 'react'
import { Navigate, Route, Routes } from 'react-router'
import LandingPage from './pages/LandingPage'
import './index.css'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import DashboardLayout from './layouts/DashboardLayout'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import EditTransaction from './pages/EditTransaction'
import ProtectedRoute from './components/auth/protectedRoute'
import { isAuthenticated } from './api/financeApi'
import PublicRoute from './components/auth/PublicRoute';
import { useAuthCheck } from './hooks/useAuthCheck'
function App() {
   useAuthCheck(); 
   const [userId, setUserId] = useState(localStorage.getItem('userId'));
 const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    setIsLoading(false);
  }, []);

if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }


  return (
    <Routes>
    
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <AuthPage type="login" />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <AuthPage type="signup" />
              </PublicRoute>
            } 
          />
          
      
         <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Dashboard />} />
          </Route>

          <Route 
            path="/transactions" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Transactions />} />
            <Route path="new" element={<AddTransaction />} />  
            <Route path="edit/:id" element={<EditTransaction />} /> 
          </Route>
<Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Analytics />} />
          </Route>

        <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Profile />} />
          </Route>
     
          <Route 
            path="*" 
            element={
              <Navigate 
                to={isAuthenticated() ? "/dashboard" : "/login"} 
                replace 
              /> 
            } 
          />
     </Routes>
 
  )
}

export default App
