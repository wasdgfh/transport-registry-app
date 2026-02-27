import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
<<<<<<< HEAD
  Button, TextField, MenuItem, Box, Autocomplete, CircularProgress
} from '@mui/material';

=======
  Button, TextField, MenuItem, Box, Autocomplete
} from '@mui/material'; 
>>>>>>> develop
import debounce from 'lodash.debounce';
import api from '../../../http';

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

  const [loadingOwner, setLoadingOwner] = useState(false);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [ownerInput, setOwnerInput] = useState('');

  const [badgeOptions, setBadgeOptions] = useState([]);
  const [loadingBadge, setLoadingBadge] = useState(false);
  const [badgeInput, setBadgeInput] = useState('');

<<<<<<< HEAD

  useEffect(() => {
    if (editingData) {
      setForm({ ...editingData, password: '' }); 
=======
  useEffect(() => {
    if (editingData) {
      setForm({ ...editingData, password: '' });
      if (editingData.passportData) {
        setOwnerInput(editingData.passportData);
      } else if (editingData.taxNumber) {
        setOwnerInput(editingData.taxNumber);
      }
      if (editingData.badgeNumber) {
        setBadgeInput(editingData.badgeNumber);
      }
>>>>>>> develop
    } else {
      setForm({
        email: '',
        password: '',
        role: '',
        passportData: '',
        taxNumber: '',
        badgeNumber: ''
      });
<<<<<<< HEAD
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
=======
      setOwnerInput('');
      setBadgeInput('');
    }
  }, [editingData, open]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    
    if (field === 'role') {
      setForm(prev => ({
        ...prev,
        passportData: '',
        taxNumber: '',
        badgeNumber: ''
      }));
      setOwnerInput('');
      setBadgeInput('');
>>>>>>> develop
    }
  };

  const handleSubmit = () => {
    const cleaned = { ...form };
<<<<<<< HEAD
=======
    const isCreating = !editingData;
>>>>>>> develop

    if (!isCreating) {
      delete cleaned.id;
      delete cleaned.createdAt;
      delete cleaned.updatedAt;
    }

    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === '') delete cleaned[key];
    });

    onSubmit(cleaned);
  };

<<<<<<< HEAD

  const isCreating = !editingData;

  const fetchOwners = debounce(async (input, type) => {
=======
  const fetchOwners = debounce(async (input, type) => {
    if (!input || input.length < 2) return;
    
>>>>>>> develop
    setLoadingOwner(true);
    try {
      if (type === 'passport') {
        const res = await api.get('/employee/natural-persons', {
          params: { search: input, limit: 10 }
        });
        setOwnerOptions(res.data.data.map(p => ({
          label: `${p.passportData} — ${p.lastName} ${p.firstName} ${p.patronymic}`,
<<<<<<< HEAD
          value: p.passportData
=======
          value: p.passportData,
          type: 'passport'
>>>>>>> develop
        })));
      } else if (type === 'tax') {
        const res = await api.get('/employee/legal-entities', {
          params: { search: input, limit: 10 }
        });
        setOwnerOptions(res.data.data.map(e => ({
          label: `${e.taxNumber} — ${e.companyName}`,
<<<<<<< HEAD
          value: e.taxNumber
=======
          value: e.taxNumber,
          type: 'tax'
>>>>>>> develop
        })));
      }
    } catch (e) {
      console.error('Ошибка загрузки владельцев:', e);
<<<<<<< HEAD
=======
      setOwnerOptions([]);
>>>>>>> develop
    } finally {
      setLoadingOwner(false);
    }
  }, 300);

  const fetchBadges = debounce(async (input) => {
<<<<<<< HEAD
=======
    if (!input || input.length < 2) return;
    
>>>>>>> develop
    setLoadingBadge(true);
    try {
      const res = await api.get('/admin/employees', {
        params: { search: input, limit: 10 }
      });

      setBadgeOptions(res.data.data.map(e => ({
        label: `${e.badgeNumber} — ${e.lastName} ${e.firstName} ${e.patronymic}`,
        value: e.badgeNumber
      })));
    } catch (e) {
      console.error('Ошибка загрузки значков:', e);
<<<<<<< HEAD
=======
      setBadgeOptions([]);
>>>>>>> develop
    } finally {
      setLoadingBadge(false);
    }
  }, 300);

<<<<<<< HEAD
=======
  const isCreating = !editingData;

>>>>>>> develop
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isCreating ? 'Создать пользователя' : 'Редактировать пользователя'}</DialogTitle>
      <DialogContent dividers>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          mt={1}
          sx={{ '& > *': { flex: '1 1 calc(50% - 16px)' } }}
        >
          <TextField
            label="Роль"
            select
            fullWidth
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

          {(form.role === 'ADMIN' || form.role === 'OWNER') && (
            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={handleChange('email')}
              required={form.role !== 'EMPLOYEE'}
            />
          )}

          {isCreating && (form.role === 'ADMIN' || form.role === 'OWNER') && (
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange('password')}
              required
            />
          )}

          {form.role === 'OWNER' && (
<<<<<<< HEAD
            <>
              <Autocomplete
                freeSolo
                clearOnEscape
                options={ownerOptions}
                loading={loadingOwner}
                value={ownerInput}
                onInputChange={(_, value, reason) => {
                  if (reason === 'clear') {
                    setOwnerInput('');
                    setForm(prev => ({ ...prev, passportData: '', taxNumber: '' }));
                    return;
                  }

                  setOwnerInput(value);

                  if (value.length >= 2) {
                    const isTax = /^\d{6,}$/.test(value);
                    fetchOwners(value, isTax ? 'tax' : 'passport');
                  }
                }}
                onChange={(_, option) => {
                  if (option && typeof option !== 'string') {
                    const isTax = /^\d{6,}$/.test(option.value);
                    setForm(prev => ({
                      ...prev,
                      passportData: isTax ? '' : option.value,
                      taxNumber: isTax ? option.value : ''
                    }));
                    setOwnerInput(option.value);
                  }
                }}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.label
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Паспорт или ИНН"
                    fullWidth
                  />
                )}
              />
            </>
=======
            <Autocomplete
              freeSolo
              clearOnEscape
              options={ownerOptions}
              loading={loadingOwner}
              inputValue={ownerInput}
              onInputChange={(_, value, reason) => {
                setOwnerInput(value || '');
                
                if (reason === 'clear') {
                  setForm(prev => ({ ...prev, passportData: '', taxNumber: '' }));
                  setOwnerOptions([]);
                  return;
                }

                if (value && value.length >= 2) {
                  const isTax = /^\d{6,}$/.test(value);
                  fetchOwners(value, isTax ? 'tax' : 'passport');
                } else {
                  setOwnerOptions([]);
                }
              }}
              onChange={(_, option) => {
                if (option && typeof option !== 'string') {
                  setForm(prev => ({
                    ...prev,
                    passportData: option.type === 'passport' ? option.value : '',
                    taxNumber: option.type === 'tax' ? option.value : ''
                  }));
                  setOwnerInput(option.value);
                }
              }}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Паспорт или ИНН"
                  fullWidth
                />
              )}
            />
>>>>>>> develop
          )}

          {form.role === 'EMPLOYEE' && (
            <Autocomplete
              freeSolo
              clearOnEscape
              options={badgeOptions}
              loading={loadingBadge}
<<<<<<< HEAD
              value={badgeInput}
              onInputChange={(_, value, reason) => {
                if (reason === 'clear') {
                  setBadgeInput('');
                  setForm(prev => ({ ...prev, badgeNumber: '' }));
                  return;
                }

                setBadgeInput(value);
                if (value.length >= 2) fetchBadges(value);
=======
              inputValue={badgeInput}
              onInputChange={(_, value, reason) => {
                setBadgeInput(value || '');
                
                if (reason === 'clear') {
                  setForm(prev => ({ ...prev, badgeNumber: '' }));
                  setBadgeOptions([]);
                  return;
                }

                if (value && value.length >= 2) {
                  fetchBadges(value);
                } else {
                  setBadgeOptions([]);
                }
>>>>>>> develop
              }}
              onChange={(_, option) => {
                if (option && typeof option !== 'string') {
                  setForm(prev => ({ ...prev, badgeNumber: option.value }));
                  setBadgeInput(option.value);
                }
              }}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Номер значка"
                  fullWidth
                  required
                />
              )}
            />
          )}
        </Box>
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

<<<<<<< HEAD
export default UserFormDialog;
=======
export default UserFormDialog;
>>>>>>> develop
