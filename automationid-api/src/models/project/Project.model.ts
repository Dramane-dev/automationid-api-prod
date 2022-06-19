import { DataTypes } from "sequelize";
import { database } from "../../database/config.database";
import moment from "moment";
import { ProjectFeasability } from "./ProjectFeasability.model";

export const Project = database.define(
    "project",
    {
        rec: {
            type: DataTypes.INTEGER({ decimals: 4 }),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        projectId: {
            type: DataTypes.STRING(16),
            allowNull: false,
            unique: true,
        },
        userId: {
            type: DataTypes.STRING(16),
            allowNull: false,
        },
        projName: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        projUnit: {
            type: DataTypes.STRING(120),
        },
        projGoal: {
            type: DataTypes.STRING(120),
        },
        projDescript: {
            type: DataTypes.STRING(2000),
        },
        projScore: {
            type: DataTypes.INTEGER({ decimals: 4 }),
            allowNull: false,
            defaultValue: 0,
        },
        projectCreat: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: moment().fromNow(),
        },
    },
    {
        charset: "utf8",
        collate: "utf8_unicode_ci",
    }
);
ProjectFeasability.belongsTo(Project, { foreignKey: "projectId" });
