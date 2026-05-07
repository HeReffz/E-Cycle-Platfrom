import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * ProtectedRoute — Redirects unauthenticated users to /LoginPage.
 * Saves the attempted URL so we can redirect back after login.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/LoginPage" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
