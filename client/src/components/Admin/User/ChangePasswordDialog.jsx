import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography
} from '@mui/material';
import { useState } from 'react';
import { patchUser } from './UserService';

function ChangePasswordDialog({ open, onClose, user, onPasswordChanged }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleConfirm = async () => {
    if (password.length < 8) {
      setErrorText('Пароль должен содержать минимум 8 символов.');
      return;
    }

    setLoading(true);
    try {
      await patchUser(user.id, { password });
      onPasswordChanged?.(); 
      onClose();
    } catch (e) {
      console.error('Ошибка при смене пароля:', e);
      setErrorText(e.response?.data?.message || 'Ошибка при смене пароля');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
    if (errorText) setErrorText('');
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Изменить пароль для {user?.email}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          type="password"
          label="Новый пароль"
          value={password}
          onChange={handleChange}
          margin="normal"
          error={Boolean(errorText)}
          helperText={errorText}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading || !password.trim()}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangePasswordDialog;
