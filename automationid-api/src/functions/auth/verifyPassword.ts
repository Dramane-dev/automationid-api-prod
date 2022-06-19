import argon2 from "argon2";

export const verifyPassword = (userPassword: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            if (!userPassword) {
                resolve(false);
            }

            resolve(argon2.verify(userPassword, password));
        } catch (error) {
            reject(error);
        }
    });
};
