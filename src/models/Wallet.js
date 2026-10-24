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

    balance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: "O saldo não pode ser negativo."
            }
        }
    },
});

module.exports = Wallet;
