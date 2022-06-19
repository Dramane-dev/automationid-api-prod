import { DataTypes } from "sequelize";
import { database } from "../../database/config.database";
import moment from "moment";
import { Project } from "../project/Project.model";
import { ValidationKeys } from "./ValidationKey.model";

export const User = database.define(
    "users",
    {
        rec: {
            type: DataTypes.UUID,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING(16),
            allowNull: false,
            unique: true,
        },
        userType: {
            type: DataTypes.STRING,
            defaultValue: "client",
            allowNull: false,
        },
        userNom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userPrenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userGenre: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "none",
        },
        userMail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        userPass: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userCreat: {
            type: DataTypes.DATE,
            defaultValue: moment().format("YYYY-MM-DD"),
            allowNull: false,
        },
        accountValid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: "n",
        },
    },
    {
        charset: "utf8",
        collate: "utf8_unicode_ci",
    }
);

User.hasMany(Project, { as: "project", foreignKey: "userId" });
Project.belongsTo(User, { as: "users", foreignKey: "userId" });
User.hasOne(ValidationKeys, { as: "validationKeys", foreignKey: "userId" });
ValidationKeys.belongsTo(User, { as: "users", foreignKey: "userId" });
