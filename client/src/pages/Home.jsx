import { useContext } from 'react';
import {
  Box, Typography, Button, Card, Grid
} from '@mui/material';
import {
  DirectionsCar, Person, RemoveCircleOutline, Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index';


function Home() {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const cards = [
    {
      icon: <DirectionsCar fontSize="large" color="primary" sx={{ mr: 2 }} />,
      title: 'Подать заявление на регистрацию транспортного средства',
      text: 'Зарегистрируйте транспортное средство в информационной системе и выберите подразделение ГИБДД для личного визита и проверки документов.'
    },
    {
      icon: <Person fontSize="large" color="primary" sx={{ mr: 2 }} />,
      title: 'Внести изменения в регистрационные данные',
      text: 'Используйте упрощённую процедуру для смены владельца или корректировки технических характеристик транспортного средства.'
    },
    {
      icon: <RemoveCircleOutline fontSize="large" color="primary" sx={{ mr: 2 }} />,
      title: 'Снять транспортное средство с учёта',
      text: 'Оформите снятие транспортного средства с регистрационного учёта удалённо через информационную систему, без необходимости личного визита.'
    },
    {
      icon: <Description fontSize="large" color="primary" sx={{ mr: 2 }} />,
      title: 'Просматривать документы и экспортировать отчёты',
      text: 'Владельцы могут просматривать регистрационные документы, а сотрудники — экспортировать отчёты по выполненным работам.'
    }
  ];


  return (
    <Box display="flex" minHeight="100vh" overflow="hidden">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          px: 4,
          background: 'transparent'
        }}
      >
        <Box
          component="img"
          src="/images/transport-illustration-main.png"
          alt="Транспортная система"
          sx={{
            maxHeight: '100vh',
            height: 'auto',
            width: 'auto'
          }}
        />
      </Box>
      
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #f7f9fc 0%, #e6efff 100%)',
          py: 6,
          px: 6
        }}
      >
        <Box maxWidth="900px" width="100%">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Добро пожаловать
          </Typography>
          <Typography variant="h6" gutterBottom>
            В данной информационной системе Вы можете выполнить следующие действия:
          </Typography>

          <Grid container spacing={3} mt={1}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    ml: index % 2 === 0 ? 0 : 3,
                    mr: index % 2 === 0 ? 3 : 0,
                    backgroundColor: '#ffffffdd',
                    boxShadow: 3
                  }}
                >
                  {card.icon}
                  <Box>
                    <Typography variant="h6" fontSize="1.15rem">{card.title}</Typography>
                    <Typography fontSize="1rem">{card.text}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {!user.isAuth && (
            <Box mt={4} textAlign="center">
              <Button variant="contained" onClick={() => navigate('/login')}>
                Войти
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
