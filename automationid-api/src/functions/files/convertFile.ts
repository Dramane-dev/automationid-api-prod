import fs, { readFileSync } from "fs";
import { IProjectInDatabase } from "../../interfaces/data/IProjectInDataBase";
import { IFilesConverted } from "../../interfaces/request/IFilesConverted";
import { IGetAttachments } from "../../interfaces/request/IGetAttachments";

export const convertFile = (filePath: string): string => {
    return fs.readFileSync(filePath, { encoding: "base64" });
};

export const convertFiles = (
    attachments: IGetAttachments[],
    project: IProjectInDatabase
): Promise<IFilesConverted[]> => {
    return new Promise((resolve, reject) => {
        let convertedFiles: IFilesConverted[] = [];

        attachments.map(async (attachment: IGetAttachments, index: number) => {
            let encodedFile: IFilesConverted = {
                Name: attachment.fileName,
                ContentBytes: readFileSync(attachment.filePath, { encoding: "base64" }),
            };

            // fs.stat(attachment.filePath, (err, stats) => {
            //     attachmentsSize += stats.size;
            //     console.log(attachmentsSize);
            // });

            convertedFiles.push(encodedFile);

            if (index === attachments.length - 1) {
                resolve(convertedFiles);
            }
        });
    });
};
