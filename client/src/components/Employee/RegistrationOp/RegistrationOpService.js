import api from '../../../http';

export const getRegistrationOps = (params) =>
  api.get('/employee/reg-op', { params });

export const patchRegistrationOp = (id, data) =>
  api.patch(`/employee/reg-op/${id}`, data);

export const createRegistrationOp = (data) =>
  api.post('/owner/reg-op', data);

export const getAvailableRegNumbers = async (search = '') => {
  const res = await api.get('/employee/reg-docs', {
    params: { search, limit: 10 }
  });
  return res.data.data.map(doc => doc.registrationNumber);
};
