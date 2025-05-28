const { Sequelize } = require('sequelize');

const isTestEnv = process.env.NODE_ENV === 'test';

const dbName = isTestEnv ? process.env.DB_TEST_NAME : process.env.DB_NAME;

if (!dbName) {
  throw new Error('Database name is not defined.');
}

if (isTestEnv && !/^.*_test$/i.test(dbName)) {
  throw new Error(`Test environment is using a non-test database: ${dbName}`);
}

module.exports = new Sequelize(
    dbName,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false
    }
);