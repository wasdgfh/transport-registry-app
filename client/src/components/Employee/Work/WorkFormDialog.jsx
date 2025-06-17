import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material';

const initialForm = {
  purpose: '',
  workDate: new Date().toISOString().split('T')[0]
};

function WorkFormDialog({ open, onClose, onSubmit, editingData, operationId }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingData) {
      setForm({
        purpose: editingData.purpose || '',
        workDate: editingData.workDate
          ? new Date(editingData.workDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      });
    } else {
      setForm({
        ...initialForm,
        workDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.purpose || form.purpose.length < 5) {
      newErrors.purpose = 'Минимум 5 символов';
    }
    if (!form.workDate) {
      newErrors.workDate = 'Укажите дату';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(operationId, form); 
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingData ? 'Редактировать работу' : 'Создать работу'}</DialogTitle>
      <DialogContent>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Назначение"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            error={!!errors.purpose}
            helperText={errors.purpose}
          />
          <TextField
            label="Дата выполнения"
            name="workDate"
            type="date"
            value={form.workDate}
            onChange={handleChange}
            error={!!errors.workDate}
            helperText={errors.workDate}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingData ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkFormDialog;
