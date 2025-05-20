const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const NaturalPerson = sequelize.define('naturalperson', {
    passportData: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        primaryKey: true,
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
    }
}, {
    tableName: 'naturalperson'
});

module.exports = NaturalPerson;