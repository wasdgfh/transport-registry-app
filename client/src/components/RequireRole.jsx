import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../index';

const RequireRole = ({ allowedRoles, children }) => {
  const { user } = useContext(Context);

  if (!user.isAuth) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.user.role)) {
    return <Navigate to="/403" />;
  }

  return children;
};

export default RequireRole;
