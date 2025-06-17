import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, Autocomplete, CircularProgress
} from '@mui/material';
import { useState, useEffect, useMemo, useContext } from 'react';
import debounce from 'lodash.debounce';
import api from '../../../http';
import { Context } from '../../../index';

const defaultForm = {
  vin: '',
  registrationNumber: '',
  unitCode: '',
  operationType: '',
  operationBase: '',
  operationDate: ''
};

const operationTypes = [
  'Постановка на учет',
  'Снятие с учета',
  'Внесение измененеий в регистрационные данные'
];

function RegistrationOpFormDialog({ open, onClose, onSubmit }) {
  const { user } = useContext(Context);

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [vinOptions, setVinOptions] = useState([]);
  const [loadingVin, setLoadingVin] = useState(false);
  const [departOptions, setDepartOptions] = useState([]);
  const [loadingDepart, setLoadingDepart] = useState(false);

  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split('T')[0];
      setForm({ ...defaultForm, operationDate: today });
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const newErrors = {};
    if (!form.vin.match(/^[A-HJ-NPR-Z0-9]{17}$/)) {
      newErrors.vin = 'Неверный VIN';
    }
    if (!form.unitCode.match(/^\d{6}$/)) {
      newErrors.unitCode = 'Должно быть 6 цифр';
    }
    if (!operationTypes.includes(form.operationType)) {
      newErrors.operationType = 'Выберите тип';
    }
    if (!form.operationBase.trim()) {
      newErrors.operationBase = 'Укажите основание';
    }
    if (!form.operationDate) {
      newErrors.operationDate = 'Дата обязательна';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchVins = useMemo(() =>
    debounce(async (input) => {
      setLoadingVin(true);
      try {
        const res = await api.get('/employee/vehicles', {
          params: { search: input, limit: 10 }
        });
        setVinOptions(res.data.data);
      } catch (e) {
        console.error('Ошибка загрузки VIN:', e);
      } finally {
        setLoadingVin(false);
      }
    }, 300), []);

  const fetchDeparts = useMemo(() =>
    debounce(async (input) => {
      setLoadingDepart(true);
      try {
        const res = await api.get('/admin/reg-depart', {
          params: { search: input, limit: 10 }
        });
        const options = res.data.data.map(dep => ({
          label: `${dep.unitCode} — ${dep.departmentName}`,
          value: dep.unitCode
        }));
        setDepartOptions(options);
      } catch (e) {
        console.error('Ошибка загрузки подразделений:', e);
      } finally {
        setLoadingDepart(false);
      }
    }, 300), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(null, form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить регистрацию</DialogTitle>
      <DialogContent>
        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <Autocomplete
            freeSolo
            options={vinOptions}
            loading={loadingVin}
            getOptionLabel={(option) =>
              typeof option === 'string'
                ? option
                : `${option.vin} — ${option.makeAndModel || '—'}`
            }
            inputValue={form.vin}
            onInputChange={(_, value, reason) => {
              if (reason === 'input') {
                setForm(prev => ({ ...prev, vin: value }));
                if (value.length >= 3) fetchVins(value);
              }
            }}
            onChange={(_, option) => {
              if (typeof option === 'string') {
                setForm(prev => ({ ...prev, vin: option }));
              } else if (option?.vin) {
                setForm(prev => ({ ...prev, vin: option.vin }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="VIN"
                error={!!errors.vin}
                helperText={errors.vin}
              />
            )}
            slots={{
              endAdornment: () => loadingVin ? <CircularProgress size={20} /> : null
            }}
          />
          <TextField
            label="Рег. номер"
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
          />
          <Autocomplete
            freeSolo
            clearOnEscape
            options={departOptions}
            loading={loadingDepart}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.label
            }
            inputValue={form.unitCode}
            onInputChange={(_, value, reason) => {
              if (reason === 'input') {
                setForm(prev => ({ ...prev, unitCode: value }));
                if (value.length >= 2) fetchDeparts(value);
              }
            }}
            onChange={(_, option) => {
              if (typeof option === 'string') {
                setForm(prev => ({ ...prev, unitCode: option }));
              } else if (option?.value) {
                setForm(prev => ({ ...prev, unitCode: option.value }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Код подразделения"
                error={!!errors.unitCode}
                helperText={errors.unitCode}
              />
            )}
            slots={{
              endAdornment: () => loadingDepart ? <CircularProgress size={20} /> : null
            }}
          />
          <TextField
            label="Тип операции"
            name="operationType"
            select
            value={form.operationType}
            onChange={handleChange}
            error={!!errors.operationType}
            helperText={errors.operationType}
          >
            {operationTypes.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Основание"
            name="operationBase"
            value={form.operationBase}
            onChange={handleChange}
            error={!!errors.operationBase}
            helperText={errors.operationBase}
            />
            <Button
            variant="outlined"
            onClick={() =>
                setForm(prev => ({
                ...prev,
                operationBase: `Заявление составлено сотрудником №${user.user?.badgeNumber || 'XXXX'}`
                }))
            }
            >
            Сформировать основание
          </Button>
          <TextField
            label="Дата операции"
            name="operationDate"
            type="date"
            value={form.operationDate}
            onChange={handleChange}
            error={!!errors.operationDate}
            helperText={errors.operationDate}
            slotProps={{
                inputLabel: { shrink: true }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}

export default RegistrationOpFormDialog;
