const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const RegistrationOp = sequelize.define('registrationop', {
    operationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    vin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    unitCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    operationType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    operationBase: {
        type: DataTypes.STRING,
        allowNull: false
    },
    operationDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'registrationop'
});

module.exports = RegistrationOp;