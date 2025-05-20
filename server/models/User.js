const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'EMPLOYEE', 'OWNER'),
        allowNull: false,
        defaultValue: 'OWNER'
    },
    passportData: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    taxNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    badgeNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    }
}, {
    tableName: 'user'
});

module.exports = User;