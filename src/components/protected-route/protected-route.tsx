import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { verifyUserSession } from '../../services/slices/UserSlice';
import { useDispatch, useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthVerified } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthVerified) {
      dispatch(verifyUserSession());
    }
  });

  const from = location.state?.from || { pathname: '/' };

  if (onlyUnAuth && user) {
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return children;
};
