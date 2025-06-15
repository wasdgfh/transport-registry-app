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
    <AppBar position="static" color="default" sx={{ mb: 3 }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            flexGrow: 1
          }}
          onClick={() => navigate('/')}
        >
          <Box
            component="img"
            src="../images/logo.png" 
            alt="logo"
            sx={{ height: 32, width: 32, mr: 1 }}
          />
          <Typography variant="h5" noWrap>
            ИС учета транспортных средств
          </Typography>
        </Box>

        {user.isAuth && user.user.role === 'EMPLOYEE' && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/employee/owners')}>Владельцы</Button>
            <Button color="inherit" onClick={() => navigate('/employee/reg-document')}>Регистрационные документы</Button>
            <Button color="inherit" onClick={() => navigate('/employee/vehicles')}>Транспортные средства</Button>
          </Box>
        )}
        {user.isAuth && user.user.role === 'ADMIN' && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/admin/employees')}>Сотрудники</Button>
            <Button color="inherit" onClick={() => navigate('/admin/departments')}>Отделы</Button>
            <Button color="inherit" onClick={() => navigate('/admin/users')}>Пользователи</Button>
          </Box>
        )}
        {user.isAuth && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/profile')}>Профиль</Button>
            <Button color="inherit" onClick={handleLogout}>Выйти</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
});

export default Header;
