import { Sequelize } from "sequelize";
import config from "./default";

export const database = new Sequelize("idea_collector", "userAutomationid", "rootroot", {
    host: "automationid-db",
    dialect: "mysql",
    logging: false,
    define: {
        timestamps: false,
    },
});
// export const database = new Sequelize(config.mySqlDatabaseName, config.mySqlUser, config.mySqlPassword, {
//     host: config.mySqlHost,
//     port: config.mysqlPort,
//     dialect: "mysql",
//     logging: false,
//     define: {
//         timestamps: false,
//     },
// });