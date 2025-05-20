const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const Employee = sequelize.define('employee', {
    badgeNumber: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    unitCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patronymic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rank: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'employee'
});

module.exports = Employee;