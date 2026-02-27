// client/src/constants/index.js
export const RANKS = [
  'Рядовой', 'Мл. сержант', 'Сержант', 'Ст. сержант',
  'Старшина', 'Прапорщик', 'Ст. прапорщик', 'Мл. лейтенант',
  'Лейтенант', 'Ст. лейтенант', 'Капитан', 'Майор',
  'Подполковник', 'Полковник'
];

export const USER_ROLES = {
  ADMIN: { value: 'ADMIN', label: 'Администратор' },
  EMPLOYEE: { value: 'EMPLOYEE', label: 'Сотрудник' },
  OWNER: { value: 'OWNER', label: 'Владелец' }
};

export const VALIDATION_RULES = {
  MIN_NAME_LENGTH: 2,
  MIN_DEPARTMENT_NAME_LENGTH: 8,
  MIN_ADDRESS_LENGTH: 8,
  UNIT_CODE_LENGTH: 6,
  BADGE_NUMBER_PATTERN: /^\d{2}-\d{4}$/
};

export const PAGINATION_LIMITS = [5, 10, 20, 50];