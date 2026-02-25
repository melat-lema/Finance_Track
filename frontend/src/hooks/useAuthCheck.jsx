import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { clearSession } from "../api/financeApi";
import { toast } from "react-toastify";
export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      
      if (!token) return;
      
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime + 60) {
          console.log('Token expiring soon, logging out...');
          clearSession();
          toast.error('Session expired. Please login again.');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        clearSession();
        navigate('/login', { replace: true });
      }
    };

    const interval = setInterval(checkTokenExpiration, 30000);
    checkTokenExpiration();
    
    return () => clearInterval(interval);
  }, [navigate]);
};