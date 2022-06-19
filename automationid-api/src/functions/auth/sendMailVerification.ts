import { axiosInstanceToMailVerification } from "../../exports/axios/axiosInstance";
import { IMailVerification } from "../../interfaces/auth/IMailVerification";
import { IUser } from "../../interfaces/auth/IUser";

export const sendMailVerification = (user: IUser): Promise<IMailVerification> => {
    return new Promise(async (resolve, reject) => {
        try {
            axiosInstanceToMailVerification
                .post("", user)
                .then((res) => {
                    const { status, message } = res.data;

                    let isSuccessSmtpResponse = status === "OK";

                    if (isSuccessSmtpResponse) {
                        resolve({
                            status: status,
                            message: "Le mail de vérification a bien été envoyé ✅",
                        });
                    } else {
                        if (status === 500 && message.includes(" n'a pa pu être envoyé")) {
                            reject({
                                status: status,
                                result: {},
                                message: "Le mail de vérification n'a pa pu être envoyé ❌",
                            });
                        }

                        reject({
                            status: message,
                            result: {},
                            message: "Le mail de vérification n'a pa pu être envoyé ❌",
                        });
                    }
                })
                .catch((error) => {
                    reject({
                        status: 500,
                        result: {},
                        message: "Le mail de vérification n'a pa pu être envoyé ❌",
                    });
                });
        } catch (error) {
            reject({
                status: 500,
                result: {},
                message: "Le mail de vérification n'a pa pu être envoyé ❌",
            });
        }
    });
};
