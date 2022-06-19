import { axiosInstanceToSendProjectNotification } from "../../exports/axios/axiosInstance";
import { IProjectInDatabase } from "../../interfaces/data/IProjectInDataBase";
import { IGetAttachments } from "../../interfaces/request/IGetAttachments";
import { convertFiles } from "../files/convertFile";
import { ProjectQuerys } from "./ProjectQuerys";

export const sendProjectNotification = (projectId: string, project: IProjectInDatabase): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        let attachments: IGetAttachments[] = await ProjectQuerys.getProjectAttachments(projectId);

        if (attachments.length > 0) {
            convertFiles(attachments, project).then((files) => {
                project.convertedAttachments = files;

                axiosInstanceToSendProjectNotification
                    .post("", project)
                    .then((res) => {
                        const { status, message } = res.data;

                        let isSuccessSmtpResponse = status === 200;

                        if (isSuccessSmtpResponse) {
                            resolve({
                                status: status,
                                message: "Votre idée a bien été envoyée ✅",
                            });
                        } else {
                            if (status === 500 && message.includes(" n'a pa pu être envoyé")) {
                                reject({
                                    status: status,
                                    result: {},
                                    message: "Votre idée n'a pa pu être envoyée ❌",
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        reject({
                            status: 500,
                            result: {},
                            message: "Votre idée n'a pa pu être envoyée ❌",
                        });
                    });
            });
        } else {
            axiosInstanceToSendProjectNotification
                .post("", project)
                .then((res) => {
                    const { status, message } = res.data;
                    let isSuccessSmtpResponse = status === 200;

                    if (isSuccessSmtpResponse) {
                        resolve({
                            status: status,
                            message: "Votre idée a bien été envoyée ✅",
                        });
                    } else {
                        if (status === 500 && message.includes(" n'a pa pu être envoyé")) {
                            reject({
                                status: status,
                                result: {},
                                message:
                                    "Votre idée n'a pa pu être envoyée, vérifiez la taille de vos pièces jointes ❌",
                            });
                        }

                        reject({
                            status: message,
                            result: {},
                            message: "Votre idée n'a pa pu être envoyée ❌",
                        });
                    }
                })
                .catch((error) => {
                    reject({
                        status: 500,
                        result: {},
                        message: "Votre idée n'a pa pu être envoyée ❌",
                    });
                });
        }
    });
};
