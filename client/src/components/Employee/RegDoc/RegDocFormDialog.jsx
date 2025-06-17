import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Autocomplete, CircularProgress
} from '@mui/material';
import debounce from 'lodash.debounce';
import api from '../../../http'; 

const initialForm = {
  registrationNumber: '',
  address: '',
  pts: '',
  sts: '',
  registrationDate: '',
  documentOwner: ''
};

const rusLetters = ['А','В','Е','К','М','Н','О','Р','С','Т','У','Х'];
const generateNumber = () => {
  const randLetter = () => rusLetters[Math.floor(Math.random() * rusLetters.length)];
  return `${randLetter()}${Math.floor(100 + Math.random() * 900)}${randLetter()}${randLetter()}`; // без последних цифр
};
const generatePTS = () => {
  const randLetter = () => rusLetters[Math.floor(Math.random() * rusLetters.length)];
  return `${Math.floor(10 + Math.random() * 90)} ${randLetter()}${randLetter()} ${Math.floor(100000 + Math.random() * 900000)}`;
};
const generateSTS = () => {
  const rand2Digit = () => Math.floor(10 + Math.random() * 90);
  return `${rand2Digit()} ${rand2Digit()} ${Math.floor(100000 + Math.random() * 900000)}`;
};

function RegDocFormDialog({ open, onClose, onSubmit, editingData }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  useEffect(() => {
    if (editingData) {
      const formattedDate = new Date(editingData.registrationDate).toISOString().split('T')[0];

      setForm({
        ...editingData,
        registrationDate: formattedDate
      });

      setSelectedOwner({
        label: editingData.documentOwner,
        value: editingData.documentOwner,
        address: editingData.address
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setForm({ ...initialForm, registrationDate: today });
      setSelectedOwner(null);
    }
    setErrors({});
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.registrationNumber.match(/^[А-Я]{1}\d{3}[А-Я]{2}\d{2,3}$/)) {
      newErrors.registrationNumber = 'Формат: А123АА77';
    }
    if (!form.pts.match(/^\d{2} [А-Я]{2} \d{6}$/)) {
      newErrors.pts = 'Формат: 12 АБ 345678';
    }
    if (!form.sts.match(/^\d{2} \d{2} \d{6}$/)) {
      newErrors.sts = 'Формат: 12 34 567890';
    }
    if (!form.registrationDate) {
      newErrors.registrationDate = 'Обязательно';
    }
    if (!form.documentOwner) {
      newErrors.documentOwner = 'Обязательно';
    }
    if (!form.address) {
      newErrors.address = 'Обязательно';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form.registrationNumber, form);
    }
  };

  const fetchOwners = debounce(async (input) => {
    setLoadingOwners(true);
    try {
      const [naturalRes, legalRes] = await Promise.all([
        api.get('/employee/natural-persons', { params: { search: input, limit: 5 } }),
        api.get('/employee/legal-entities', { params: { search: input, limit: 5 } })
      ]);

      const combined = [
        ...naturalRes.data.data.map(p => ({
          label: `${p.lastName} ${p.firstName} ${p.patronymic} — ${p.passportData}`,
          value: p.passportData,
          address: p.address
        })),
        ...legalRes.data.data.map(e => ({
          label: `${e.companyName} — ${e.taxNumber}`,
          value: e.taxNumber,
          address: e.address
        }))
      ];

      setOwnerOptions(combined);
    } catch (e) {
      console.error('Ошибка загрузки владельцев:', e);
    } finally {
      setLoadingOwners(false);
    }
  }, 300);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingData ? 'Редактировать документ' : 'Создать документ'}</DialogTitle>
      <DialogContent>
        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Рег. номер"
            name="registrationNumber"
            value={form.registrationNumber}
            onChange={handleChange}
            error={!!errors.registrationNumber}
            helperText={errors.registrationNumber}
            disabled={!!editingData}
          />
          <TextField
            label="Адрес"
            name="address"
            value={form.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            label="ПТС"
            name="pts"
            value={form.pts}
            onChange={handleChange}
            error={!!errors.pts}
            helperText={errors.pts}
          />
          <TextField
            label="СТС"
            name="sts"
            value={form.sts}
            onChange={handleChange}
            error={!!errors.sts}
            helperText={errors.sts}
          />
          <TextField
            label="Дата регистрации"
            name="registrationDate"
            type="date"
            value={form.registrationDate}
            onChange={handleChange}
            error={!!errors.registrationDate}
            helperText={errors.registrationDate}
            slotProps={{
              textField: {
                InputLabelProps: { shrink: true }
              }
            }}
          />
          {!editingData && (
          <Button
              variant="outlined"
              onClick={() => setForm(prev => ({ ...prev, registrationNumber: generateNumber() }))}
            >
              Сгенерировать гос. номер
            </Button>
          )}

          <Button
            variant="outlined"
            onClick={() => setForm(prev => ({ ...prev, pts: generatePTS() }))}
          >
            Сгенерировать ПТС
          </Button>

          <Button
            variant="outlined"
            onClick={() => setForm(prev => ({ ...prev, sts: generateSTS() }))}
          >
            Сгенерировать СТС
          </Button>
          <Autocomplete
            freeSolo
            loading={loadingOwners}
            options={ownerOptions}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.label
            }
            inputValue={form.documentOwner}
            onInputChange={(_, value, reason) => {
              if (reason === 'input') {
                setForm(prev => ({ ...prev, documentOwner: value }));
                if (value.length >= 2) fetchOwners(value);
              }
            }}
            onChange={(_, option) => {
              if (option && typeof option !== 'string') {
                setForm(prev => ({
                  ...prev,
                  documentOwner: option.value,
                  address: option.address
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Владелец (паспорт / ИНН)"
                error={!!errors.documentOwner}
                helperText={errors.documentOwner}
                slots={{
                  endAdornment: () => (
                    <>
                      {loadingOwners ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps?.endAdornment}
                    </>
                  )
                }}
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

export default RegDocFormDialog;
