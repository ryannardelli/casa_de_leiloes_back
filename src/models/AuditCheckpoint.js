const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const AuditCheckpoint = sequelize.define("AuditCheckpoint", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    lotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    lastBidId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    lastBidHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },

    signature: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = AuditCheckpoint;
