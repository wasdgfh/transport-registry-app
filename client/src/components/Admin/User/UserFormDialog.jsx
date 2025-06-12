import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid
} from '@mui/material';

const roleOptions = [
  { value: 'ADMIN', label: 'Администратор' },
  { value: 'EMPLOYEE', label: 'Сотрудник' },
  { value: 'OWNER', label: 'Владелец' }
];

function UserFormDialog({ open, onClose, onSubmit, editingData }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',
    passportData: '',
    taxNumber: '',
    badgeNumber: ''
  });

  useEffect(() => {
    if (editingData) {
      setForm({ ...editingData, password: '' }); 
    } else {
      setForm({
        email: '',
        password: '',
        role: '',
        passportData: '',
        taxNumber: '',
        badgeNumber: ''
      });
    }
  }, [editingData]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field === 'passportData' && value.trim()) {
      setForm((prev) => ({ ...prev, passportData: value, taxNumber: '' }));
    } else if (field === 'taxNumber' && value.trim()) {
      setForm((prev) => ({ ...prev, taxNumber: value, passportData: '' }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    const cleaned = { ...form };
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === '') delete cleaned[key];
    });
    onSubmit(cleaned);
  };

  const isCreating = !editingData;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isCreating ? 'Создать пользователя' : 'Редактировать пользователя'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              label="Роль"
              select
              fullWidth
              style={{ minWidth: 100 }}
              value={form.role}
              onChange={handleChange('role')}
              required
            >
              {roleOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {(form.role === 'ADMIN' || form.role === 'OWNER') && (
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={form.email}
                onChange={handleChange('email')}
                required={form.role !== 'EMPLOYEE'}
              />
            </Grid>
          )}

          {isCreating && (form.role === 'ADMIN' || form.role === 'OWNER') && (
            <Grid item xs={12}>
              <TextField
                label="Пароль"
                type="password"
                fullWidth
                value={form.password}
                onChange={handleChange('password')}
                required
              />
            </Grid>
          )}

          {form.role === 'OWNER' && (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Паспортные данные (XXXX XXXXXX)"
                  fullWidth
                  value={form.passportData}
                  onChange={handleChange('passportData')}
                  disabled={!!form.taxNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ИНН (10 цифр)"
                  fullWidth
                  value={form.taxNumber}
                  onChange={handleChange('taxNumber')}
                  disabled={!!form.passportData}
                />
              </Grid>
            </>
          )}

          {form.role === 'EMPLOYEE' && (
            <Grid item xs={12}>
              <TextField
                label="Номер значка"
                fullWidth
                value={form.badgeNumber}
                onChange={handleChange('badgeNumber')}
                required
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isCreating ? 'Создать' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserFormDialog;
