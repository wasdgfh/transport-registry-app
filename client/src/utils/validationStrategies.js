export const validationStrategies = {
  employee: {
    badgeNumber: (value) => 
      !value.match(/^\d{2}-\d{4}$/) ? 'Формат: 00-0000' : null,
    unitCode: (value) => 
      !value || value.length !== 6 ? '6 символов' : null,
    lastName: (value) => 
      !value || value.length < 2 ? 'Мин. 2 символа' : null,
    firstName: (value) => 
      !value || value.length < 2 ? 'Мин. 2 символа' : null,
    patronymic: (value) => 
      !value || value.length < 2 ? 'Мин. 2 символа' : null,
    rank: (value, validRanks) => 
      !validRanks.includes(value) ? 'Недопустимое звание' : null
  },
  
  department: {
    unitCode: (value) => 
      !value || value.length !== 6 ? 'Код должен содержать 6 символов' : null,
    departmentName: (value) => 
      !value || value.length < 8 ? 'Название минимум 8 символов' : null,
    address: (value) => 
      !value || value.length < 8 ? 'Адрес минимум 8 символов' : null
  }
};

export const validate = (type, data, context = {}) => {
  const errors = {};
  const strategy = validationStrategies[type];
  
  if (!strategy) return errors;
  
  Object.keys(strategy).forEach(field => {
    if (data.hasOwnProperty(field)) {
      const error = strategy[field](data[field], context[field]);
      if (error) errors[field] = error;
    }
  });
  
  return errors;
};