import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            let secret: string = String(process.env.ACCESS_TOKEN_SECRET);
            resolve(jwt.sign({ id: userId }, secret));
        } catch (error) {
            reject(error);
        }
    });
};
