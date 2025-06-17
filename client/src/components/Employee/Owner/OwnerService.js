import api from '../../../http';

export const getNaturalPersons = (params) =>
  api.get('/employee/natural-persons', { params });

export const getLegalEntities = (params) =>
  api.get('/employee/legal-entities', { params });

export const patchNaturalPerson = (passport, data) =>
  api.patch(`/employee/natural-persons/${passport}`, data);

export const patchLegalEntity = (taxNumber, data) =>
  api.patch(`/employee/legal-entities/${taxNumber}`, data);
