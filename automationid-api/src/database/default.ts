import dotenv from "dotenv";
dotenv.config();

export default {
    port: parseInt(String(process.env.SERVER_PORT)),
    mySqlHost: process.env.DATABASE_HOST,
    mySqlDatabaseName: String(process.env.DATABASE_NAME),
    mysqlPort: parseInt(String(process.env.DATABASE_PORT)),
    mySqlUser: String(process.env.DATABASE_USER),
    mySqlPassword: String(process.env.DATABASE_PASSWORD),
}