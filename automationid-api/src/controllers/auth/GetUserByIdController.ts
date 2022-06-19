import { database } from "../../database/config.database";
import { IUser } from "../../interfaces/auth/IUser";

export const GetUserByIdController = (userId: string): Promise<IUser> => {
    return new Promise(async (resolve, reject) => {
        database
            .query(
                `SELECT * FROM users LEFT JOIN validationKeys ON users.userId = validationKeys.userId WHERE users.userId = '${userId}'`
            )
            .then(async (resultat) => {
                const [requestResult]: any = resultat;
                let actualUser: IUser = requestResult[0];

                if (actualUser !== undefined && actualUser !== null) {
                    resolve(actualUser);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};
