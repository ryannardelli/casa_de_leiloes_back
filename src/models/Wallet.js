
const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Wallet = sequelize.define("Wallet", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },

    totalBalance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },

    committedBalance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },

    availableBalance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Wallet;
