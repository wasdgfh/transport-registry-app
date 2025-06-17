import api from '../../../http';

export const getVehicles = (params) =>
  api.get('/employee/vehicles', { params });

export const getVehicleByVin = (vin) =>
  api.get(`/employee/vehicles/${vin}`);

export const patchVehicle = (vin, data) =>
  api.patch(`/employee/vehicles/${vin}`, data);

export const putVehicle = (vin, data) =>
  api.put(`/employee/vehicles/${vin}`, data);

export const createVehicle = (data) =>
  api.post('/owner/vehicles', data);
