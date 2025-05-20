const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const LegalEntity = sequelize.define('legalentity', {
    taxNumber: {
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
    companyName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'legalentity'
});

module.exports = LegalEntity;