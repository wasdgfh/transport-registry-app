import { useContext, useEffect, useState } from 'react';
import { Context } from '../index';
import {
  Container, Typography, Box, CircularProgress, Alert, Paper, Divider
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import http from '../http';

const ProfilePage = observer(() => {
  const { user } = useContext(Context);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfileData = async () => {
    try {
<<<<<<< HEAD
      let res = null;

      if (user.user.role === 'OWNER') {
        if (user.user.passportData) {
          res = await http.get(`/employee/natural-persons/${user.user.passportData}`);
        } else if (user.user.taxNumber) {
          res = await http.get(`/employee/legal-entities/${user.user.taxNumber}`);
        }
      } else if (user.user.role === 'EMPLOYEE' && user.user.badgeNumber) {
        res = await http.get(`/admin/employees/search?badgeNumber=${user.user.badgeNumber}`);
      }

      if (res?.data) setProfileData(res.data);
    } catch (err) {
      console.error(err);
=======
      setError('');
      const response = await http.get('/profile');
      
      if (response.data?.user) {
        setProfileData(response.data.user);
      } else {
        throw new Error('Некорректный формат данных');
      }
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
>>>>>>> develop
      setError('Ошибка загрузки данных профиля');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchProfileData();
  }, []);
=======
    if (user.user && Object.keys(user.user).length > 0) {
      fetchProfileData();
    } else {
      const timeout = setTimeout(() => {
        if (!user.user) {
          setLoading(false);
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [user.user]);

  if (!user.user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }
>>>>>>> develop

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Профиль пользователя
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

<<<<<<< HEAD
      {user.user.role === 'ADMIN' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Администратор ИС
        </Alert>
      )}

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        profileData && (
          <Paper sx={{ mt: 3, p: 3, backgroundColor: '#fff' }} elevation={3}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Email:</strong> {user.user.email}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {user.user.role === 'EMPLOYEE' && (
              <>
                <Typography><strong>ФИО:</strong> {profileData.lastName} {profileData.firstName} {profileData.patronymic}</Typography>
                <Typography><strong>Номер значка:</strong> {profileData.badgeNumber}</Typography>
                <Typography><strong>Код подразделения:</strong> {profileData.unitCode}</Typography>
                <Typography><strong>Звание:</strong> {profileData.rank}</Typography>
              </>
            )}

            {user.user.passportData && (
              <>
                <Typography><strong>ФИО:</strong> {profileData.lastName} {profileData.firstName} {profileData.patronymic}</Typography>
                <Typography><strong>Паспортные данные:</strong> {profileData.passportData}</Typography>
                <Typography><strong>Адрес:</strong> {profileData.address}</Typography>
              </>
            )}

            {user.user.taxNumber && (
              <>
                <Typography><strong>Название компании:</strong> {profileData.companyName}</Typography>
                <Typography><strong>ИНН:</strong> {profileData.taxNumber}</Typography>
                <Typography><strong>Адрес:</strong> {profileData.address}</Typography>
              </>
            )}
          </Paper>
        )
      )}
    </Container>
  );
});

export default ProfilePage;
=======
      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <>
          {/* Для админа показываем только alert */}
          {user.user.role === 'ADMIN' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Администратор ИС
            </Alert>
          )}

          {/* Для всех остальных ролей показываем Paper с данными */}
          {user.user.role !== 'ADMIN' && profileData && (
            <Paper sx={{ mt: 3, p: 3, backgroundColor: '#fff' }} elevation={3}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {user.user.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {profileData.role === 'EMPLOYEE' && (
                <>
                  <Typography><strong>ФИО:</strong> {profileData.lastName} {profileData.firstName} {profileData.patronymic}</Typography>
                  <Typography><strong>Номер значка:</strong> {profileData.badgeNumber}</Typography>
                  <Typography><strong>Код подразделения:</strong> {profileData.unitCode}</Typography>
                  <Typography><strong>Звание:</strong> {profileData.rank}</Typography>
                </>
              )}

              {profileData.role === 'OWNER' && profileData.passportData && (
                <>
                  <Typography><strong>ФИО:</strong> {profileData.lastName} {profileData.firstName} {profileData.patronymic}</Typography>
                  <Typography><strong>Паспортные данные:</strong> {profileData.passportData}</Typography>
                  <Typography><strong>Адрес:</strong> {profileData.address}</Typography>
                </>
              )}

              {profileData.role === 'OWNER' && profileData.taxNumber && (
                <>
                  <Typography><strong>Название компании:</strong> {profileData.companyName}</Typography>
                  <Typography><strong>ИНН:</strong> {profileData.taxNumber}</Typography>
                  <Typography><strong>Адрес:</strong> {profileData.address}</Typography>
                </>
              )}
            </Paper>
          )}

          {/* Если нет данных и это не админ */}
          {user.user.role !== 'ADMIN' && !profileData && !loading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Нет данных для отображения
            </Alert>
          )}
        </>
      )}
    </Container>
  );

});

export default ProfilePage;
>>>>>>> develop
