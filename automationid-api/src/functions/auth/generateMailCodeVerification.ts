import crypto from "crypto";

export const generateMailCodeVerification = (): string => {
    return crypto.randomBytes(5).toString("hex");
};
