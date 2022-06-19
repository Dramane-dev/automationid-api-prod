import { DataTypes } from "sequelize";
import { database } from "../../database/config.database";
import moment from "moment";

export const ProjectFeasability = database.define(
    "project_feasability",
    {
        rec: {
            type: DataTypes.INTEGER({ decimals: 11 }),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        projectId: {
            type: DataTypes.STRING(16),
            allowNull: true,
            unique: true,
        },
        projQ1: {
            type: DataTypes.TEXT,
        },
        projCom1: {
            type: DataTypes.TEXT,
        },
        projQ2: {
            type: DataTypes.TEXT,
        },
        projCom2: {
            type: DataTypes.TEXT({ length: "long" }),
        },
        projQ3: {
            type: DataTypes.TEXT,
        },
        projCom3: {
            type: DataTypes.TEXT({ length: "long" }),
        },
        projQ4: {
            type: DataTypes.TEXT,
        },
        projCom4: {
            type: DataTypes.TEXT({ length: "long" }),
        },
    },
    {
        charset: "utf8",
        collate: "utf8_unicode_ci",
    }
);
