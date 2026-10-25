const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const WalletTransaction = sequelize.define("WalletTransaction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    type: {
        type: DataTypes.ENUM("DEPOSIT"),
        allowNull: false,
    },

    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "O valor da transação deve ser positivo.",
            },
        },
    },
});

module.exports = WalletTransaction;