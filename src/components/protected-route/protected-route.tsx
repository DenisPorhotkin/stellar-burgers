import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';

type TProtectedRoute = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRoute> = ({
  onlyUnAuth = false,
  children
}) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const isLoggedIn = Boolean(user);
  const location = useLocation();
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isLoggedIn) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
