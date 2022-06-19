import crypto from "crypto";

export const generateUserId = (): string => {
    // return "USR" + crypto.randomBytes(8).toString("hex");
    return "USR" + Date.now();
};
