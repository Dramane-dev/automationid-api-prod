import { database } from "./config.database";

export const connectionToDatabase = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        database.authenticate()
        .then(() => resolve("Database connection established ✅"))
        .catch((error) => reject(`Database connection error ❌ : ${error} ${error.message}`));
    });
}