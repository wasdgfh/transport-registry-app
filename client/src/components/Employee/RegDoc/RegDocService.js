import api from '../../../http';

export const getRegDocs = (params) => {
  return api.get('/employee/reg-docs', { params });
};

export const getRegDocByRegNumber = (regNumber) => {
  return api.get(`/employee/reg-docs/${regNumber}`);
};

export const postRegDoc = (data) => {
  return api.post('/employee/reg-docs', data);
};

export const putRegDoc = (regNumber, data) => {
  return api.put(`/employee/reg-docs/${regNumber}`, data);
};

export const patchRegDoc = (regNumber, data) => {
  return api.patch(`/employee/reg-docs/${regNumber}`, data);
};
