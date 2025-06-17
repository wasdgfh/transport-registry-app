import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Checkbox, FormControlLabel,
  MenuItem, Select, InputLabel, FormControl, Box
} from '@mui/material';

const defaultForm = {
  vin: '',
  makeAndModel: '',
  releaseYear: '',
  manufacture: '',
  typeOfDrive: '',
  power: '',
  hasChassisNumber: false,
  bodyColor: '',
  transmissionType: '',
  steeringWheel: '',
  engineModel: '',
  engineVolume: ''
};

function TransportVehicleFormDialog({ open, onClose, onSubmit, editingData }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingData) {
      setForm({ ...editingData, hasChassisNumber: !!editingData.chassisNumber });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.vin.match(/^[A-HJ-NPR-Z0-9]{17}$/)) {
      newErrors.vin = 'VIN должен состоять из 17 символов (латинские буквы, кроме I, O, Q, и цифры)';
    }

    if (!form.makeAndModel.trim()) newErrors.makeAndModel = 'Обязательно';
    if (!form.releaseYear.match(/^(19|20)\d{2}$/)) {
      newErrors.releaseYear = 'Год выпуска должен быть в формате YYYY (1950-2025)';
    }
    if (!form.manufacture.trim()) newErrors.manufacture = 'Обязательно';

    if (!['FWD', 'RWD', 'AWD', '4WD'].includes(form.typeOfDrive)) {
      newErrors.typeOfDrive = 'Неверное значение';
    }

    if (!form.power.match(/^\d+\s*кВт\/\d+\s*л\.с\.$/)) {
      newErrors.power = 'Мощность должна быть в формате "число кВт/число л.с."';
    }

    if (!form.bodyColor.trim()) newErrors.bodyColor = 'Обязательно';

    if (!['MT', 'AT', 'AMT', 'CVT', 'DCT', 'DSG'].includes(form.transmissionType)) {
      newErrors.transmissionType = 'Неверное значение';
    }

    if (!['Левостороннее', 'Правостороннее'].includes(form.steeringWheel)) {
      newErrors.steeringWheel = 'Неверное значение';
    }

    if (!form.engineModel.match(/^[A-Z0-9-]+$/)) {
      newErrors.engineModel = 'Допустимы латинские буквы, цифры и дефис';
    }

    const volume = parseInt(form.engineVolume);
    if (isNaN(volume) || volume < 500 || volume > 7400) {
      newErrors.engineVolume = 'Объем должен быть от 500 до 7400 см³';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const {
      vin,
      bodyNumber,
      chassisNumber,
      createdAt,
      updatedAt,
      ...cleanedForm
    } = form;

    const isEdit = !!editingData;
    const id = isEdit ? editingData.vin : vin;

    if (!isEdit) {
      cleanedForm.vin = vin;
    }

    onSubmit(id, cleanedForm);
  };



  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{editingData ? 'Редактировать ТС' : 'Добавить ТС'}</DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          mt={1}
          sx={{ '& > *': { flex: '1 1 calc(50% - 16px)' } }}
        >
          <TextField
            fullWidth label="VIN" name="vin" value={form.vin}
            onChange={handleChange} disabled={!!editingData}
            error={!!errors.vin} helperText={errors.vin}
          />
          <TextField
            fullWidth label="Марка и модель" name="makeAndModel" value={form.makeAndModel}
            onChange={handleChange}
            error={!!errors.makeAndModel} helperText={errors.makeAndModel}
          />

          <TextField
            fullWidth label="Год выпуска" name="releaseYear" value={form.releaseYear}
            onChange={handleChange}
            error={!!errors.releaseYear} helperText={errors.releaseYear}
          />
          <TextField
            fullWidth label="Изготовитель" name="manufacture" value={form.manufacture}
            onChange={handleChange}
            error={!!errors.manufacture} helperText={errors.manufacture}
          />

          <FormControl fullWidth error={!!errors.typeOfDrive}>
            <InputLabel id="typeOfDrive-label">Тип привода</InputLabel>
            <Select
              labelId="typeOfDrive-label"
              id="typeOfDrive"
              name="typeOfDrive"
              value={form.typeOfDrive}
              label="Тип привода"
              onChange={handleChange}
            >
              <MenuItem value="FWD">FWD</MenuItem>
              <MenuItem value="RWD">RWD</MenuItem>
              <MenuItem value="AWD">AWD</MenuItem>
              <MenuItem value="4WD">4WD</MenuItem>
            </Select>
            {errors.typeOfDrive && <Box sx={{ color: 'error.main', fontSize: 12 }}>{errors.typeOfDrive}</Box>}
          </FormControl>

          <TextField
            fullWidth label="Мощность, кВт/л.с." name="power" value={form.power}
            onChange={handleChange}
            error={!!errors.power} helperText={errors.power}
          />
          <TextField
            fullWidth label="Цвет кузова" name="bodyColor" value={form.bodyColor}
            onChange={handleChange}
            error={!!errors.bodyColor} helperText={errors.bodyColor}
          />

          <FormControl fullWidth error={!!errors.transmissionType}>
            <InputLabel id="transmissionType-label">Тип коробки передач</InputLabel>
            <Select
              labelId="transmissionType-label"
              id="transmissionType"
              name="transmissionType"
              value={form.transmissionType}
              label="Тип коробки передач"
              onChange={handleChange}
            >
              <MenuItem value="MT">MT</MenuItem>
              <MenuItem value="AT">AT</MenuItem>
              <MenuItem value="AMT">AMT</MenuItem>
              <MenuItem value="CVT">CVT</MenuItem>
              <MenuItem value="DCT">DCT</MenuItem>
              <MenuItem value="DSG">DSG</MenuItem>
            </Select>
            {errors.transmissionType && <Box sx={{ color: 'error.main', fontSize: 12 }}>{errors.transmissionType}</Box>}
          </FormControl>

          <FormControl fullWidth error={!!errors.steeringWheel}>
            <InputLabel id="steeringWheel-label">Положение руля</InputLabel>
            <Select
              labelId="steeringWheel-label"
              id="steeringWheel"
              name="steeringWheel"
              value={form.steeringWheel}
              label="Положение руля"
              onChange={handleChange}
            >
              <MenuItem value="Левостороннее">Левостороннее</MenuItem>
              <MenuItem value="Правостороннее">Правостороннее</MenuItem>
            </Select>
            {errors.steeringWheel && <Box sx={{ color: 'error.main', fontSize: 12 }}>{errors.steeringWheel}</Box>}
          </FormControl>

          <TextField
            fullWidth label="Модель двигателя" name="engineModel" value={form.engineModel}
            onChange={handleChange}
            error={!!errors.engineModel} helperText={errors.engineModel}
          />
          <TextField
            fullWidth label="Рабочий объем, см³" name="engineVolume" value={form.engineVolume}
            onChange={handleChange}
            error={!!errors.engineVolume} helperText={errors.engineVolume}
          />

          <Box flex="1 1 100%">
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.hasChassisNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, hasChassisNumber: e.target.checked }))}
                />
              }
              label="Наличие номера шасси"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransportVehicleFormDialog;
