const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const Work = sequelize.define('work', {
    badgeNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    operationId: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false
    },
    workDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'work'
});

module.exports = Work;
