import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { useContext, useEffect } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import Home from '../pages/Home';

function AppRouter() {
  const { user } = useContext(Context);
  
  useEffect(() => {
    if (localStorage.getItem('token')) {
      user.checkAuth();
    }
  }, [user]);

  return (
    <Routes>
      {user.isAuth && authRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default observer(AppRouter);