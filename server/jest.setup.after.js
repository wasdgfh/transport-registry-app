const sequelize = require('./db'); 

beforeAll(async () => {
  const dbName = sequelize.getDatabaseName();
  if (!/^.*_test$/i.test(dbName)) {
    throw new Error(`Refusing to sync non-test database: ${dbName}`);
  }

  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close(); 
});
