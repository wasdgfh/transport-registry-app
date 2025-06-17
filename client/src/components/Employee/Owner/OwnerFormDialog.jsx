import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid
} from '@mui/material';

const defaultForm = {
  passportData: '',
  taxNumber: '',
  lastName: '',
  firstName: '',
  patronymic: '',
  companyName: '',
  address: ''
};

function OwnerFormDialog({ open, onClose, onSubmit, editingData, type }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (editingData) {
      setForm(editingData);
    } else {
      setForm(defaultForm);
    }
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const id = type === 'natural' ? form.passportData : form.taxNumber;
    const updateData = { ...form };
    delete updateData.passportData;
    delete updateData.taxNumber;
    onSubmit(id, updateData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Редактировать владельца</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          {type === 'natural' ? (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Паспорт"
                  name="passportData"
                  value={form.passportData}
                  disabled
                />
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Фамилия" name="lastName" value={form.lastName} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Имя" name="firstName" value={form.firstName} onChange={handleChange} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Отчество" name="patronymic" value={form.patronymic} onChange={handleChange} /></Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ИНН"
                  name="taxNumber"
                  value={form.taxNumber}
                  disabled
                />
              </Grid>
              <Grid item xs={12}><TextField fullWidth label="Название компании" name="companyName" value={form.companyName} onChange={handleChange} /></Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Адрес"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}

export default OwnerFormDialog;
