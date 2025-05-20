const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const Owner = sequelize.define('owner', {
    address: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    }
}, {
    tableName: 'owner'
});

module.exports = Owner;