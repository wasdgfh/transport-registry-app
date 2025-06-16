import api from '../../../http';

export const getEmployeeWorks = (params) => {
  return api.get('/employee/work', { params });
};

export const postEmployeeWork = (data) => {
  return api.post('/employee/work', data);
};

export const patchEmployeeWork = (id, data) => {
  return api.patch(`/employee/work/${id}`, data);
};
