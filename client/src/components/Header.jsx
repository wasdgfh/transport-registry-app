import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const Header = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    user.logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: '1px solid #e0e0e0',
        mb: 3,
        backgroundColor: '#f9f9f9'
      }}
    >
    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
      >
        <Box
          component="img"
          src="../images/logo.png"
          alt="logo"
          sx={{ height: 36, width: 36, mr: 1 }}
        />
        <Typography
          variant="h5"
          noWrap
          fontWeight={500}
          color="text.primary"
        >
          ИС учёта транспортных средств
        </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {user.isAuth && user.user.role === 'OWNER' && (
            <Button variant="text" onClick={() => navigate('/vehicles')}>
              Транспортные средства
            </Button>
          )}

          {user.isAuth && user.user.role === 'EMPLOYEE' && (
            <>
              <Button variant="text" onClick={() => navigate('/employee/owners')}>Владельцы</Button>
              <Button variant="text" onClick={() => navigate('/employee/reg-document')}>Рег. документы</Button>
              <Button variant="text" onClick={() => navigate('/employee/vehicles')}>ТС</Button>
              <Button variant="text" onClick={() => navigate('/employee/operations')}>Операции</Button>
              <Button variant="text" onClick={() => navigate('/employee/works')}>Работы</Button>
            </>
          )}

          {user.isAuth && user.user.role === 'ADMIN' && (
            <>
              <Button variant="text" onClick={() => navigate('/admin/employees')}>Сотрудники</Button>
              <Button variant="text" onClick={() => navigate('/admin/departments')}>Отделы</Button>
              <Button variant="text" onClick={() => navigate('/admin/users')}>Пользователи</Button>
            </>
          )}

          {user.isAuth && (
            <>
              <Button variant="outlined" onClick={() => navigate('/profile')}>Профиль</Button>
              <Button variant="contained" color="error" onClick={handleLogout}>Выйти</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
