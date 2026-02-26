import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../../api/financeApi';
import Spinner from '../common/Spinner';
import { useState, useEffect } from 'react';

const protectedRoute = ({ children, requireEmail = false }) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token) {
      try {
        const user = userStr ? JSON.parse(userStr) : null;
    
        if (requireEmail && !user?.email) {
        
          setAuth({ isAuthenticated: false, user: null });
        } else {
          setAuth({ isAuthenticated: true, user });
        }
      } catch (error) {
        console.error('Failed to parse user:', error);
        setAuth({ isAuthenticated: false, user: null });
      }
    }
    
    setChecking(false);
  }, [requireEmail]);


  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner size={50} />
      </div>
    );
  }


  if (!auth.isAuthenticated) {
 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default protectedRoute;