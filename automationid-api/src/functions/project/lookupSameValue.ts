import { IProjectInDatabase } from "../../interfaces/data/IProjectInDataBase";

export const lookupSameValue = (project: IProjectInDatabase): Promise<IProjectInDatabase> => {
    return new Promise(async (resolve, reject) => {
        let keys: string[] = ["frequency", "partOfError", "peakOfActivity", "remoteApp", "digitDatas", "scanedFiles"];

        keys.map(async (key: string) => {
            switch (true) {
                case key === "frequency":
                    project.idFreq = (await lookup(project.idFreq)) as string;
                    break;
                case key === "partOfError":
                    project.idErrPart = (await lookup(project.idErrPart)) as number;
                    break;
                case key === "peakOfActivity":
                    project.idPicAct = (await lookup(project.idPicAct)) as string;
                    break;
                case key === "remoteApp":
                    project.idRemoteApp = (await lookup(project.idRemoteApp)) as string;
                    break;
                case key === "digitDatas":
                    project.idDigitData = (await lookup(project.idDigitData)) as number;
                    break;
                case key === "scanedFiles":
                    project.idScanDocs = (await lookup(project.idScanDocs)) as string;
                    break;
                default:
                    break;
            }
        });
        resolve(project);
    });
};

export const lookup = (key: string | number): Promise<string | number> => {
    return new Promise((resolve, reject) => {
        switch (true) {
            case key === "d":
                key = "Jour";
                resolve(key);
            case key === "w":
                key = "Semaine";
                resolve(key);
            case key === "m":
                key = "Mois";
                resolve(key);
            case key === "p-c":
                key = "Projet-Campagne";
                resolve(key);
            case key === "y":
                key = "Oui";
                resolve(key);
                break;
            case key === "n":
                key = "Non";
                resolve(key);
            default:
                break;
        }
    });
};
