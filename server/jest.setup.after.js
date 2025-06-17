const sequelize = require('./db'); 

beforeAll(async () => {
  await sequelize.sync({ force: true });
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  await sequelize.close(); 
  console.error.mockRestore();
});
