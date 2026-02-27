import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, Checkbox, FormControlLabel,
  Select, InputLabel, FormControl, Autocomplete, Typography, CircularProgress
} from '@mui/material';
import { useContext, useEffect, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import api from '../../http';
import { Context } from '../../index';

const defaultVehicle = {
  vin: '', makeAndModel: '', releaseYear: '', manufacture: '',
  typeOfDrive: '', power: '', hasChassisNumber: false,
  bodyColor: '', transmissionType: '', steeringWheel: '',
  engineModel: '', engineVolume: ''
};

const defaultOp = {
  unitCode: '', operationType: 'Постановка на учет',
  operationBase: '', operationDate: new Date().toISOString().split('T')[0]
};

function RegistrationWithVehicleDialog({ open, onClose, onSuccess }) {
  const { user } = useContext(Context);

  const [vehicle, setVehicle] = useState(defaultVehicle);
  const [opData, setOpData] = useState(defaultOp);
  const [departOptions, setDepartOptions] = useState([]);
  const [loadingDepart, setLoadingDepart] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const passport = user.user?.passportData;
      const inn = user.user?.taxNumber;
      const isIndividual = !!passport;

      const detail = isIndividual
        ? `паспорт: ${passport}`
        : inn
          ? `ИНН: ${inn}`
          : 'данные владельца не указаны';

      setVehicle(defaultVehicle);
      setOpData({
        ...defaultOp,
        operationBase: `Заявление составлено владельцем — ${detail}`
      });
      setErrors({});
    }
  }, [open, user]);

  const fetchDeparts = useMemo(() =>
    debounce(async (input) => {
      setLoadingDepart(true);
      try {
        const res = await api.get('/admin/reg-depart', {
          params: { search: input, limit: 10 }
        });
        const options = res.data.data.map(d => ({
          label: `${d.unitCode} — ${d.departmentName}`,
          value: d.unitCode
        }));
        setDepartOptions(options);
      } catch (e) {
        console.error('Ошибка при загрузке отделов:', e);
      } finally {
        setLoadingDepart(false);
      }
    }, 300), []);

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleOpChange = (e) => {
    const { name, value } = e.target;
    setOpData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    
    if (!vehicle.vin) {
      errs.vin = 'VIN обязателен';
    } else if (!vehicle.vin.match(/^[A-HJ-NPR-Z0-9]{17}$/i)) {
      errs.vin = 'VIN должен состоять из 17 символов (латинские буквы, кроме I, O, Q, и цифры)';
    } else if (vehicle.vin.match(/^\d+$/)) {
      errs.vin = 'VIN не может состоять только из цифр';
    }

    if (!vehicle.makeAndModel) {
      errs.makeAndModel = 'Обязательно';
    } else if (vehicle.makeAndModel.length < 2) {
      errs.makeAndModel = 'Минимум 2 символа';
    } else if (vehicle.makeAndModel.length > 100) {
      errs.makeAndModel = 'Максимум 100 символов';
    } else if (vehicle.makeAndModel.match(/^\d+$/)) {
      errs.makeAndModel = 'Марка и модель не могут состоять только из цифр';
    } else if (vehicle.makeAndModel.match(/^[0-9\s]+$/)) {
      errs.makeAndModel = 'Марка и модель должны содержать буквы';
    }

    if (!vehicle.manufacture) {
      errs.manufacture = 'Обязательно';
    } else if (vehicle.manufacture.length < 2) {
      errs.manufacture = 'Минимум 2 символа';
    } else if (vehicle.manufacture.length > 100) {
      errs.manufacture = 'Максимум 100 символов';
    } else if (vehicle.manufacture.match(/^\d+$/)) {
      errs.manufacture = 'Изготовитель не может состоять только из цифр';
    } else if (vehicle.manufacture.match(/^[0-9\s]+$/)) {
      errs.manufacture = 'Изготовитель должен содержать буквы';
    }

    if (!vehicle.bodyColor) {
      errs.bodyColor = 'Обязательно';
    } else if (vehicle.bodyColor.length < 2) {
      errs.bodyColor = 'Минимум 2 символа';
    } else if (vehicle.bodyColor.length > 50) {
      errs.bodyColor = 'Максимум 50 символов';
    } else if (vehicle.bodyColor.match(/^\d+$/)) {
      errs.bodyColor = 'Цвет должен быть указан буквами (например: "Белый", "Черный", "Синий")';
    } else if (vehicle.bodyColor.match(/^[0-9\s]+$/)) {
      errs.bodyColor = 'Цвет не может состоять только из цифр, укажите название цвета';
    } else if (!vehicle.bodyColor.match(/[а-яА-Яa-zA-Z]/)) {
      errs.bodyColor = 'Цвет должен содержать буквы (например: "Красный", "Silver", "Black")';
    }

    if (!vehicle.engineModel) {
      errs.engineModel = 'Модель двигателя обязательна';
    } else if (!vehicle.engineModel.match(/^[A-Z0-9-]+$/i)) {
      errs.engineModel = 'Модель двигателя должна содержать только латинские буквы, цифры и дефис';
    } else if (vehicle.engineModel.match(/^\d+$/)) {
      errs.engineModel = 'Модель двигателя не может состоять только из цифр';
    }

    const currentYear = new Date().getFullYear();
    if (!vehicle.releaseYear) {
      errs.releaseYear = 'Год выпуска обязателен';
    } else if (!vehicle.releaseYear.match(/^(19|20)\d{2}$/)) {
      errs.releaseYear = `Год выпуска должен быть в формате YYYY (1950-${currentYear})`;
    } else if (parseInt(vehicle.releaseYear) > currentYear) {
      errs.releaseYear = `Год не может быть больше ${currentYear}`;
    }

    if (!vehicle.typeOfDrive) {
      errs.typeOfDrive = 'Выберите тип привода';
    } else if (!['FWD', 'RWD', 'AWD', '4WD'].includes(vehicle.typeOfDrive)) {
      errs.typeOfDrive = 'Неверно';
    }

    if (!vehicle.power) {
      errs.power = 'Мощность обязательна';
    } else if (!vehicle.power.match(/^\d+\s*кВт\/\d+\s*л\.с\.$/)) {
      errs.power = 'Формат: "число кВт/число л.с." (например: "150 кВт/204 л.с.")';
    }

    if (!vehicle.transmissionType) {
      errs.transmissionType = 'Выберите тип коробки передач';
    } else if (!['MT', 'AT', 'AMT', 'CVT', 'DCT', 'DSG'].includes(vehicle.transmissionType)) {
      errs.transmissionType = 'Неверно';
    }

    if (!vehicle.steeringWheel) {
      errs.steeringWheel = 'Выберите положение руля';
    } else if (!['Правостороннее', 'Левостороннее'].includes(vehicle.steeringWheel)) {
      errs.steeringWheel = 'Неверно';
    }

    if (!vehicle.engineVolume) {
      errs.engineVolume = 'Объем двигателя обязателен';
    } else if (isNaN(vehicle.engineVolume)) {
      errs.engineVolume = 'Объем двигателя должен быть числом';
    } else if (vehicle.engineVolume < 500) {
      errs.engineVolume = 'Объем двигателя должен быть не менее 500 см³';
    } else if (vehicle.engineVolume > 7400) {
      errs.engineVolume = 'Объем двигателя должен быть не более 7400 см³';
    }

    if (!opData.unitCode) {
      errs.unitCode = 'Код подразделения обязателен';
    } else if (!opData.unitCode.match(/^\d{6}$/)) {
      errs.unitCode = 'Код подразделения должен состоять из 6 цифр';
    }

    if (!opData.operationBase || !opData.operationBase.trim()) {
      errs.operationBase = 'Основание операции обязательно';
    } else if (opData.operationBase.trim().match(/^\d+$/)) {
      errs.operationBase = 'Основание не может состоять только из цифр';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const vehicleData = {
        vin: vehicle.vin.toUpperCase(), 
        makeAndModel: vehicle.makeAndModel,
        releaseYear: vehicle.releaseYear,
        manufacture: vehicle.manufacture,
        typeOfDrive: vehicle.typeOfDrive,
        power: vehicle.power,
        hasChassisNumber: vehicle.hasChassisNumber,
        bodyColor: vehicle.bodyColor,
        transmissionType: vehicle.transmissionType,
        steeringWheel: vehicle.steeringWheel,
        engineModel: vehicle.engineModel.toUpperCase(), 
        engineVolume: Number(vehicle.engineVolume) 
      };

      let vin = vehicleData.vin;
      try {
        const vehicleRes = await api.post('/owner/vehicles', vehicleData);
        vin = vehicleRes.data.data.vin;
      } catch (err) {
        if (err.response?.status === 409) {
          console.warn('ТС уже существует, создаём операцию');
        } else {
          throw err;
        }
      }

      const regRes = await api.post('/owner/reg-op', {
        ...opData,
        vin,
        registrationNumber: '',
        operationType: 'Постановка на учет'
      });

      onSuccess(regRes.data.data);
      onClose();
    } catch (e) {
      console.error('Ошибка при отправке:', e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Подача заявления на регистрацию ТС</DialogTitle>
      <DialogContent dividers>
        <Box mt={1}>
          <Typography variant="h6" gutterBottom>Данные транспортного средства</Typography>
          <Box display="flex" flexWrap="wrap" gap={2} sx={{ '& > *': { flex: '1 1 calc(50% - 16px)' } }}>
            <TextField label="VIN" name="vin" fullWidth value={vehicle.vin} onChange={handleVehicleChange} error={!!errors.vin} helperText={errors.vin} />
            <TextField label="Марка и модель" name="makeAndModel" fullWidth value={vehicle.makeAndModel} onChange={handleVehicleChange} error={!!errors.makeAndModel} helperText={errors.makeAndModel} />
            <TextField label="Год выпуска" name="releaseYear" fullWidth value={vehicle.releaseYear} onChange={handleVehicleChange} error={!!errors.releaseYear} helperText={errors.releaseYear} />
            <TextField label="Изготовитель" name="manufacture" fullWidth value={vehicle.manufacture} onChange={handleVehicleChange} error={!!errors.manufacture} helperText={errors.manufacture} />
            <FormControl fullWidth error={!!errors.typeOfDrive}>
              <InputLabel>Тип привода</InputLabel>
              <Select name="typeOfDrive" value={vehicle.typeOfDrive} onChange={handleVehicleChange} label="Тип привода">
                {['FWD', 'RWD', 'AWD', '4WD'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Мощность кВт/л.с." name="power" fullWidth value={vehicle.power} onChange={handleVehicleChange} error={!!errors.power} helperText={errors.power} />
            <TextField label="Цвет кузова" name="bodyColor" fullWidth value={vehicle.bodyColor} onChange={handleVehicleChange} error={!!errors.bodyColor} helperText={errors.bodyColor} />
            <FormControl fullWidth error={!!errors.transmissionType}>
              <InputLabel>Тип коробки передач</InputLabel>
              <Select name="transmissionType" value={vehicle.transmissionType} onChange={handleVehicleChange} label="Тип коробки передач">
                {['MT', 'AT', 'AMT', 'CVT', 'DCT', 'DSG'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth error={!!errors.steeringWheel}>
              <InputLabel>Положение руля</InputLabel>
              <Select name="steeringWheel" value={vehicle.steeringWheel} onChange={handleVehicleChange} label="Положение руля">
                <MenuItem value="Левостороннее">Левостороннее</MenuItem>
                <MenuItem value="Правостороннее">Правостороннее</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Модель двигателя" name="engineModel" fullWidth value={vehicle.engineModel} onChange={handleVehicleChange} error={!!errors.engineModel} helperText={errors.engineModel} />
            <Box display="flex" alignItems="center" gap={2} sx={{ flex: '1 1 100%' }}>
              <TextField label="Рабочий объем, см³" name="engineVolume" fullWidth value={vehicle.engineVolume} onChange={handleVehicleChange} error={!!errors.engineVolume} helperText={errors.engineVolume} />
              <FormControlLabel control={<Checkbox checked={vehicle.hasChassisNumber} onChange={(e) => setVehicle(prev => ({ ...prev, hasChassisNumber: e.target.checked }))} />} label="Наличие номера шасси" />
            </Box>
          </Box>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Данные регистрационной операции</Typography>
          <Box display="flex" flexWrap="wrap" gap={2} sx={{ '& > *': { flex: '1 1 calc(50% - 16px)' } }}>
            <TextField label="Дата подачи заявления" name="operationDate" type="date" fullWidth value={opData.operationDate} onChange={handleOpChange} InputLabelProps={{ shrink: true }} />
            <Autocomplete
              fullWidth
              freeSolo
              options={departOptions}
              loading={loadingDepart}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              value={departOptions.find(opt => opt.value === opData.unitCode) || opData.unitCode}
              onInputChange={(_, value, reason) => {
                setOpData(prev => ({ ...prev, unitCode: value }));
                if (reason === 'input' && value.length >= 2) fetchDeparts(value);
              }}
              onChange={(_, option) => {
                if (option?.value) {
                  setOpData(prev => ({ ...prev, unitCode: option.value }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Код подразделения" fullWidth error={!!errors.unitCode} helperText={errors.unitCode} InputLabelProps={{ shrink: true }} />
              )}
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

export default RegistrationWithVehicleDialog;
