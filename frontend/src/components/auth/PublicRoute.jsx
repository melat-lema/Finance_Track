import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../api/financeApi';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated()) {
    return <Navigate to={from} replace />;
  }


  return children;
};

export default PublicRoute;