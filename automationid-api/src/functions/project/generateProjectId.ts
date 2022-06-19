import crypto from "crypto";

export const generateProjectId = (): string => {
    // return "PJT" + crypto.randomBytes(8).toString("hex");
    return "PJT" + Date.now();
};
