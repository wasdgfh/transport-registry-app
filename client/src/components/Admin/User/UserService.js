import api from '../../../http';

export const getUsers = (params) => api.get('/admin/users', { params });
export const searchUser = (query) => api.get('/admin/users/search', { params: query });
export const createUser = (data) => api.post('/admin/users', data);
export const patchUser = (id, data) => api.patch(`/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
