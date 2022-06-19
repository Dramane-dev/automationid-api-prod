import { DataTypes } from "sequelize";
import { database } from "../../database/config.database";

export const ProjectPayoff = database.define(
    "project_payoff",
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
        pjtMembers: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        pjtFreq: {
            type: DataTypes.STRING,
            defaultValue: "unknown",
        },
        pjtTreats: {
            type: DataTypes.INTEGER({ decimals: 3 }),
            defaultValue: 0,
        },
        pjtDuree: {
            type: DataTypes.STRING(14),
            allowNull: false,
            defaultValue: "00:00:00:01",
        },
    },
    {
        charset: "utf8",
        collate: "utf8_unicode_ci",
    }
);

// `pjtErrPart` SET('0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100') DEFAULT '0',
// `pjtPicAct` SET('y', 'n') DEFAULT 'n',
// `pjtPicCom` text(2400) COLLATE utf8_unicode_ci,
// `pjtSteps` int(3) DEFAULT 0,
// `pjtRules`  int(3) DEFAULT 0,
// `pjtAppUsed`  int(3) DEFAULT 0,
// `pjtRemoteApp` SET('y', 'n') DEFAULT 'n',
// `pjtDigitData` SET('0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100') DEFAULT '0',
// `pjtScanDocs` SET('y', 'n') DEFAULT 'n',
