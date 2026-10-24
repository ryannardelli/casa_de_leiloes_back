const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Lot = sequelize.define("Lot", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    auctioneerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    externalItemId: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    title: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "O título do lote é obrigatório."
            },
            len: {
                args: [1, 150],
                msg: "O título deve ter entre 1 e 150 caracteres."
            }
        }
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
            isUrl: {
                msg: "A URL da imagem é inválida."
            }
        }
    },

    attributes: {
        type: DataTypes.JSONB,
        allowNull: true,
    },

    startingPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "O valor inicial deve ser maior que zero."
            }
        }
    },

    minimumIncrement: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: "O incremento mínimo deve ser maior que zero."
            }
        }
    },

    currentPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },

    startAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                msg: "A data de início é inválida."
            }
        }
    },

    endAt: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                msg: "A data de encerramento é inválida."
            }
        }
    },

    status: {
        type: DataTypes.ENUM(
            "SCHEDULED",
            "LIVE",
            "CLOSED",
            "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "SCHEDULED",
    },

    winnerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    finalPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
    },

    settledAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = Lot;
