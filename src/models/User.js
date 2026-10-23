const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [2, 100],
                msg: "O nome precisa ter pelo menos 2 letras e no máximo 100."
            }
        }
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "O e-mail deve ser válido."
            }
        }
    },

    role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user"
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

     profileId: {
        type: DataTypes.INTEGER,
        references: {
            model: "profile",
            key: "id"
        }
    },
}, {
    tableName: "users",
    freezeTableName: true
});

module.exports = User;