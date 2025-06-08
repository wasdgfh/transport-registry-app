import { useContext } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE, LOGIN_ROUTE } from '../utils/consts';

function Home() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Добро пожаловать!
        </Typography>
        
        {user.isAuth ? (
          <>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Вы вошли как: {user.user.email}
            </Typography>
            {user.user.role === 'ADMIN' && (
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate(ADMIN_ROUTE)}
              >
                Панель администратора
              </Button>
            )}
            <Button 
              variant="outlined" 
              size="large"
              sx={{ ml: 2 }}
              onClick={() => user.logout()}
            >
              Выйти
            </Button>
          </>
        ) : (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate(LOGIN_ROUTE)}
          >
            Войти в систему
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default Home;