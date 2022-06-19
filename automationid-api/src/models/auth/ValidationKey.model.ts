import { DataTypes } from "sequelize";
import { database } from "../../database/config.database";
import { User } from "./User.model";

export const ValidationKeys = database.define("validationKeys", {
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
        references: {
            model: User,
            key: "userId",
        },
    },
    key: {
        type: DataTypes.STRING(160),
        allowNull: false,
        unique: true,
    },
    keyType: {
        type: DataTypes.STRING,
        defaultValue: "autre",
        allowNull: false,
    },
});
