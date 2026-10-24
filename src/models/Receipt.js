const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Receipt = sequelize.define("Receipt", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    lotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },

    winnerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    auctioneerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    winningAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "O valor do arremate deve ser maior que zero."
            }
        }
    },

    verificationCode: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
    },

    issuedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Receipt;
