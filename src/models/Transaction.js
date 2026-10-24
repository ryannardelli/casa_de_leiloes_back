const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Transaction = sequelize.define("Transaction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    walletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    lotId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    type: {
        type: DataTypes.ENUM(
            "DEPOSIT",
            "COMMIT",
            "RELEASE",
            "AUCTION_DEBIT",
            "AUCTION_CREDIT"
        ),
        allowNull: false,
    },

    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "O valor da movimentação deve ser maior que zero."
            }
        }
    },

    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
});

module.exports = Transaction;
