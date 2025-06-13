import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

const isAuth = () => Boolean(localStorage.getItem('token'));

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const auth = isAuth();

  if (onlyUnAuth && auth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !auth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
