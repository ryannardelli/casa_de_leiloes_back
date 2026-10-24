const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Bid = sequelize.define("Bid", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    lotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    bidderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "O valor do lance deve ser maior que zero."
            }
        }
    },

    previousHash: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },

    hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
    },
});

module.exports = Bid;
