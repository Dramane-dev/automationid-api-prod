import { Sequelize } from "sequelize";
import config from "./default";

export const database = new Sequelize(config.mySqlDatabaseName, config.mySqlUser, config.mySqlPassword, {
    host: config.mySqlHost,
    dialect: "mysql",
    logging: false,
    define: {
        timestamps: false,
    },
});