import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast(
        (t) => (
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-gray-800">
              Bạn cần đăng nhập để tiếp tục đặt vé.
            </span>
          </div>
        ),
        {
          id: 'protected-route-toast',
          duration: 4000,
          icon: '🔒',
          style: {
            borderRadius: '10px',
            background: '#ffffff',
            color: '#1b1c1c',
            border: '1px solid #e4e2e2',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
        }
      );
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.AUTH.LOGIN}?redirect=${redirectUrl}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
