import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Autocomplete, CircularProgress
} from '@mui/material';
import debounce from 'lodash.debounce';
import api from '../../../http';
<<<<<<< HEAD
=======
import { RANKS } from '../../../constants'; 
import { validate } from '../../../utils/validationStrategies';
>>>>>>> develop

const initialForm = {
  badgeNumber: '',
  unitCode: '',
  lastName: '',
  firstName: '',
  patronymic: '',
  rank: ''
};

function EmployeeFormDialog({ open, onClose, onSubmit, editingData }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [departOptions, setDepartOptions] = useState([]);
  const [loadingDeparts, setLoadingDeparts] = useState(false);
<<<<<<< HEAD
  const [selectedDepart, setSelectedDepart] = useState(null);

  const validRanks = [
    'Рядовой',
    'Мл. сержант',
    'Сержант',
    'Ст. сержант',
    'Старшина',
    'Прапорщик',
    'Ст. прапорщик',
    'Мл. лейтенант',
    'Лейтенант',
    'Ст. лейтенант',
    'Капитан',
    'Майор',
    'Подполковник',
    'Полковник'
  ];
=======
>>>>>>> develop

  useEffect(() => {
    if (editingData) {
      setForm(editingData);
<<<<<<< HEAD
      setSelectedDepart({
        label: `${editingData.unitCode} — ${editingData.departmentName || ''}`,
        value: editingData.unitCode
      });
    } else {
      setForm(initialForm);
      setSelectedDepart(null);
=======
    } else {
      setForm(initialForm);
>>>>>>> develop
    }
    setErrors({});
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const validate = () => {
    const newErrors = {};
    if (!form.badgeNumber.match(/^\d{2}-\d{4}$/)) {
      newErrors.badgeNumber = 'Формат: 00-0000';
    }
    if (!form.unitCode || form.unitCode.length !== 6) {
      newErrors.unitCode = '6 символов';
    }
    if (!validRanks.includes(form.rank)) {
      newErrors.rank = 'Недопустимое звание';
    } 
    ['lastName', 'firstName', 'patronymic'].forEach(field => {
      if (!form[field] || form[field].length < 2) {
        newErrors[field] = 'Мин. 2 символа';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
=======
  const validateForm = () => {
    const validationErrors = validate('employee', form, { validRanks: RANKS });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
>>>>>>> develop
      const data = {
        unitCode: form.unitCode,
        lastName: form.lastName,
        firstName: form.firstName,
        patronymic: form.patronymic,
        rank: form.rank
      };

      if (!editingData) {
        data.badgeNumber = form.badgeNumber;
      }

      const id = form.badgeNumber;
      onSubmit(data, id);
    }
  };

  const fetchDeparts = debounce(async (input) => {
    setLoadingDeparts(true);
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
      setLoadingDeparts(false);
    }
  }, 300);

  const generateBadgeNumber = async () => {
    const prefixMatch = form.badgeNumber.match(/^(\d{2})-$/);
    let prefix = '';
    if (prefixMatch) {
      prefix = prefixMatch[1];
    }

    if (prefix) {
      try {
        const res = await api.get('/admin/employees', {
          params: { search: `${prefix}-`, limit: 50 }
        });

        const existingNumbers = res.data.data
          .map(e => e.badgeNumber)
          .filter(b => b.startsWith(`${prefix}-`))
          .map(b => parseInt(b.split('-')[1], 10))
          .sort((a, b) => a - b);

        let nextNumber = 1;
        for (let i = 0; i < existingNumbers.length; i++) {
          if (existingNumbers[i] !== nextNumber) break;
          nextNumber++;
        }

        const formatted = `${prefix}-${nextNumber.toString().padStart(4, '0')}`;
        setForm(prev => ({ ...prev, badgeNumber: formatted }));
      } catch (e) {
        console.error('Ошибка генерации номера значка:', e);
      }
    } else {
      const randPrefix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      const randSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setForm(prev => ({ ...prev, badgeNumber: `${randPrefix}-${randSuffix}` }));
    }
  };

<<<<<<< HEAD

=======
>>>>>>> develop
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingData ? 'Редактировать сотрудника' : 'Создать сотрудника'}</DialogTitle>
      <DialogContent>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Номер значка"
            name="badgeNumber"
            value={form.badgeNumber}
            onChange={handleChange}
            error={!!errors.badgeNumber}
            helperText={errors.badgeNumber}
            disabled={!!editingData}
          />
          {!editingData && (
            <Button
              variant="outlined"
              onClick={generateBadgeNumber}
            >
              Сгенерировать номер значка
            </Button>
          )}
          <Autocomplete
            freeSolo
            clearOnEscape
            loading={loadingDeparts}
            options={departOptions}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
            inputValue={form.unitCode}
            onInputChange={(_, value, reason) => {
              if (reason === 'clear') {
                setForm(prev => ({ ...prev, unitCode: '' }));
                return;
              }
              if (reason === 'input') {
                setForm(prev => ({ ...prev, unitCode: value }));
                if (value.length >= 2) fetchDeparts(value);
              }
            }}
            onChange={(_, option) => {
              if (option && typeof option !== 'string') {
                setForm(prev => ({
                  ...prev,
                  unitCode: option.value
                }));
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
              endAdornment: () => (
                <>
                  {loadingDeparts ? <CircularProgress size={20} /> : null}
                </>
              )
            }}
          />
<<<<<<< HEAD
          <TextField label="Фамилия" name="lastName" value={form.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} />
          <TextField label="Имя" name="firstName" value={form.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} />
          <TextField label="Отчество" name="patronymic" value={form.patronymic} onChange={handleChange} error={!!errors.patronymic} helperText={errors.patronymic} />
          <Autocomplete
            freeSolo
            clearOnEscape
            options={validRanks}
=======
          <TextField 
            label="Фамилия" 
            name="lastName" 
            value={form.lastName} 
            onChange={handleChange} 
            error={!!errors.lastName} 
            helperText={errors.lastName} 
          />
          <TextField 
            label="Имя" 
            name="firstName" 
            value={form.firstName} 
            onChange={handleChange} 
            error={!!errors.firstName} 
            helperText={errors.firstName} 
          />
          <TextField 
            label="Отчество" 
            name="patronymic" 
            value={form.patronymic} 
            onChange={handleChange} 
            error={!!errors.patronymic} 
            helperText={errors.patronymic} 
          />
          <Autocomplete
            freeSolo
            clearOnEscape
            options={RANKS}
>>>>>>> develop
            inputValue={form.rank}
            onInputChange={(_, value, reason) => {
              if (reason === 'clear') {
                setForm(prev => ({ ...prev, rank: '' }));
                return;
              }
              setForm(prev => ({ ...prev, rank: value }));
            }}
            onChange={(_, value) => {
              if (typeof value === 'string') {
                setForm(prev => ({ ...prev, rank: value }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Звание"
                error={!!errors.rank}
                helperText={errors.rank}
              />
            )}
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

<<<<<<< HEAD
export default EmployeeFormDialog;
=======
export default EmployeeFormDialog;
>>>>>>> develop
