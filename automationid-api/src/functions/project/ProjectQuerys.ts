import { database } from "../../database/config.database";
import { IFeasibility } from "../../interfaces/data/IFeasibility";
import { IMeets } from "../../interfaces/data/IMeets";
import { IPayoff } from "../../interfaces/data/IPayoff";
import { IPreview } from "../../interfaces/data/IPreview";
import { IProject } from "../../interfaces/data/IProject";
import { IProjectQueryResult } from "../../interfaces/data/IProjectQueryResult";
import { IGetProjects } from "../../interfaces/request/IGetProjects";
import { IGetProjectInformationsToCardsResponse } from "../../interfaces/request/IGetProjectsInformationsToCardsResponse";
import { IProjectInformationsToCards } from "../../interfaces/request/IProjectInformationsToCards";
import { ISaveProejctResponse } from "../../interfaces/request/ISaveProjectResponse";
import { IGetAttachments } from "../../interfaces/request/IGetAttachments";
import { lookupSameValue } from "./lookupSameValue";
import { IProjectInDatabase } from "../../interfaces/data/IProjectInDataBase";
import { IUpdateProjectResponse } from "../../interfaces/request/IUpdateProjectResponse";
import fs, { unlink } from "fs";
import { IDeleteAttachment } from "../../interfaces/request/IDeleteAttachment";
import path from "path";
import { generateId } from "../generateId";

export const ProjectQuerys = {
    savePreviewDatasToDatabase(userId: string, project: IProject): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let projectId: string = generateId("PJT");
            let sqlQuery: string = `INSERT INTO ideas(
                ideaId, userId, idName, idUnit, idGoal, idDescript
            ) VALUES(
                "${projectId}", "${userId}", "${project.projectName}", "${project.businessUnit}", "${project.automatisationMainPurpose}", "${project.projectDescription}"
            )`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Save preview to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Preview data's saved successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Save preview to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    saveFeasabilityDatasToDatabase(
        userId: string,
        projectId: string,
        project: IProject
    ): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `INSERT INTO idea_feasibility(
                ideaId, idQ1, idCom1, idQ2, idCom2, 
                idQ3, idCom3, idQ4, idCom4
            ) VALUES(
                "${projectId}", "${project.processRules}", "${project.processRulesComment}", "${project.functionnalProcedure}", 
                "${project.functionnalProcedureComment}", "${project.isDataStructured}", "${project.isDataStructuredComment}", 
                "${project.processStability}", "${project.processStabilityComment}"
            )`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Save feasibility to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Feasibility data's saved successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Save feasibility to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    savePayoffDatasToDatabase(userId: string, projectId: string, project: IProject): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            switch (true) {
                case project.frequencyOfProcess === "Jour":
                    project.frequencyOfProcess = "d";
                    break;
                case project.frequencyOfProcess === "Semaine":
                    project.frequencyOfProcess = "w";
                    break;
                case project.frequencyOfProcess === "Mois":
                    project.frequencyOfProcess = "m";
                    break;
                case project.frequencyOfProcess === "Projet-campagne":
                    project.frequencyOfProcess = "p-c";
                    break;
                default:
                    break;
            }

            let sqlQuery: string = `INSERT INTO idea_payoff(
                ideaId, idMembers, idFreq, idTreats, idDuree, 
                idErrPart, idPicAct, idPicCom, idSteps, idRules, 
                idAppUsed, idRemoteApp, idDigitData,  idScanDocs
            ) VALUES (
                "${projectId}", ${project.numberOfPeopleWorkToThisProcess}, "${project.frequencyOfProcess}", ${
                project.numberOfTreatments
            }, "${project.realisationMediumTime} ${project.realisationMediumTimeSecondPart}",
                "${project.partOfError}", "${project.peakOfActivity === "Oui" ? "y" : "n"}", "${
                project.payOffComment
            }", ${project.processSteps}, ${project.rulesOfDecisionToReachEndOfProcess},
                ${project.numberOfApps}, "${project.appsAccessibilityInRemoteDesktop === "Oui" ? "y" : "n"}", "${
                project.ratialsOfDigitalisedDatas
            }", "${project.scanedFiles === "Oui" ? "y" : "n"}"
            )`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Save payoff to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Payoff data's saved successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Save payoff to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    saveMeetingDatasToDatabase(userId: string, projectId: string, project: IProject): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let meetingId: string = generateId("MTG");
            let sqlQuery: string = `INSERT INTO idea_meets(
                ideaId, meetingId, meeting1, meeting2, meeting3
            ) VALUES(
                "${projectId}", "${meetingId}", "${project.firstMeet}", "${project.secondMeet}", "${project.thirdMeet}"
            )`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Save meetings to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Meetings data's saved successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Save meetings to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    saveProjectStatus(userId: string, projectId: string): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `INSERT INTO idea_status(ideaId) VALUES("${projectId}")`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Save project status to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Project status data's saved successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Save project status to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    getLastProjectCreatedByUserId(userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT * FROM ideas 
            WHERE userId = "${userId}" 
            ORDER BY ideaId DESC LIMIT 1`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let lastProject: IProjectQueryResult = result[0][0] as IProjectQueryResult;
                    resolve(lastProject.projectId);
                })
                .catch((error) => {
                    reject({
                        message: error.message,
                    });
                });
        });
    },
    saveAttachments(
        userId: string,
        projectId: string,
        attachments: Express.Multer.File[]
    ): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            // let projectId: string = await this.getLastProjectCreatedByUserId(userId);
            attachments.map((attachment: Express.Multer.File, index: number) => {
                let sqlQuery: string = `INSERT INTO idea_files(
                        ideaId, fileName, fileType, filePath
                    ) VALUES(
                        "${projectId}", "${attachment.filename}", "${attachment.mimetype}", "${attachment.path}"
                    )`;

                database
                    .query(sqlQuery)
                    .then(() => {
                        if (((attachments?.length - 1) as number) === index) {
                            resolve({
                                query: "[ Save attachment to database ]",
                                indexOfAttachments: index,
                                status: true,
                                projectId: projectId,
                                userId: "",
                                message: "Attachment data's saved successfully  ✅",
                            });
                        }
                    })
                    .catch((error) => {
                        reject({
                            query: "[ Save attachment to database ]",
                            status: false,
                            code: error.original.code,
                            message: error.message,
                        });
                    });
            });
        });
    },
    getAllProjectsInformations(): Promise<IGetProjects> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT * FROM ideas 
            INNER JOIN idea_feasibility ON ideas.ideaId = idea_feasibility.ideaId 
            INNER JOIN idea_payoff ON ideas.ideaId = idea_payoff.ideaId 
            INNER JOIN idea_meets ON ideas.ideaId = idea_meets.ideaId
            INNER JOIN idea_status ON ideas.ideaId = idea_status.ideaId
            WHERE idea_status.statusValue = "À l'étude" OR idea_status.statusValue = "Finalisé"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let allProjects: IProjectInDatabase[] = result[0] as IProjectInDatabase[];

                    allProjects.map(async (project: IProjectInDatabase, index: number) => {
                        await lookupSameValue(project);
                    });

                    resolve({
                        query: "[ Get all projects ]",
                        status: true,
                        message: "All projects getted ✅",
                        result: allProjects,
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Get all projects ]",
                        status: false,
                        message: error.message,
                        result: [],
                    });
                });
        });
    },
    getAllProjectsInformationsByUserId(userId: string): Promise<IGetProjects> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT * FROM ideas
            INNER JOIN idea_feasibility ON ideas.ideaId = idea_feasibility.ideaId 
            INNER JOIN idea_payoff ON ideas.ideaId = idea_payoff.ideaId 
            INNER JOIN idea_meets ON ideas.ideaId = idea_meets.ideaId
            INNER JOIN idea_status ON ideas.ideaId = idea_status.ideaId
            WHERE ideas.userId = "${userId}"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let projects: IProjectInDatabase[] = result[0] as IProjectInDatabase[];

                    projects.map(async (project: IProjectInDatabase, index: number) => {
                        await lookupSameValue(project);
                    });

                    resolve({
                        query: "[ Get all projects by userId ]",
                        status: true,
                        message: "All projects by user id getted ✅",
                        result: projects,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    resolve({
                        query: "[ Get all projects by userId ]",
                        status: false,
                        message: error.message,
                        result: [],
                    });
                });
        });
    },
    getProjectsInformationsToCards(): Promise<IGetProjectInformationsToCardsResponse> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT ideas.projectId, ideas.userId, ideas.projName, ideas.projUnit, ideas.projGoal, ideas.projScore, ideas.projCreat, idea_status.statusValue 
            FROM ideas INNER JOIN idea_status ON ideas.ideaId = idea_status.ideaId`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let projectsInformations: IProjectInformationsToCards[] =
                        result[0] as IProjectInformationsToCards[];
                    resolve({
                        query: "[ Get projects informations to cards ]",
                        status: true,
                        message: "Project informations getted successfully  ✅",
                        result: projectsInformations,
                    });
                })
                .catch((error) => {
                    resolve({
                        query: "[ Get projects informations to cards ]",
                        status: false,
                        message: error.message,
                    });
                });
        });
    },
    getProjectsInformationsToCardsById(userId: string): Promise<IGetProjectInformationsToCardsResponse> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT ideas.ideaId, ideas.userId, ideas.projName, ideas.projUnit, ideas.projGoal, ideas.projScore, ideas.projCreat, idea_status.statusValue 
            FROM ideas INNER JOIN idea_status ON ideas.ideaId = idea_status.ideaId
            WHERE ideas.userId = "${userId}"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let projectsInformations: IProjectInformationsToCards[] =
                        result[0] as IProjectInformationsToCards[];
                    resolve({
                        query: "[ Get projects informations to cards ]",
                        status: true,
                        message: "Project informations getted successfully  ✅",
                        result: projectsInformations,
                    });
                })
                .catch((error) => {
                    resolve({
                        query: "[ Get projects informations to cards ]",
                        status: false,
                        message: error.message,
                    });
                });
        });
    },
    getProjectsPreviewByUserIdAndProjectId(projectId: string): Promise<IGetProjects> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT * FROM ideas
            WHERE ideas.ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let projectsPreview: IPreview[] = result[0] as IPreview[];
                    resolve({
                        query: "[ Get preview informations to database ]",
                        status: true,
                        message: "Preview informations getted successfully  ✅",
                        result: projectsPreview,
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Get preview informations to database ]",
                        status: false,
                        message: error.message,
                        result: [],
                    });
                });
        });
    },
    getProjectFeasibilityByUserIdAndProjectId(projectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT * FROM idea_feasibility
            WHERE idea_feasibility.ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let projectsFeasibility: IFeasibility[] = result[0] as IFeasibility[];
                    resolve({
                        query: "[ Get feasibility informations to database ]",
                        status: true,
                        message: "Feasibility informations getted successfully  ✅",
                        result: projectsFeasibility,
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Get feasibility informations to database ]",
                        status: false,
                        message: error.message,
                        result: [],
                    });
                });
        });
    },
    getProjectPayoffByUserIdAndProjectId(projectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT * FROM idea_payoff
            WHERE idea_payoff.ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let projectsPayoff: IPayoff[] = result[0] as IPayoff[];
                    resolve({
                        query: "[ Get payoff informations to database ]",
                        status: true,
                        message: "Payoff informations getted successfully  ✅",
                        result: projectsPayoff,
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Get payoff informations to database ]",
                        status: false,
                        message: error.message,
                        result: [],
                    });
                });
        });
    },
    getProjectMeetsByUserIdAndProjectId(projectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT * FROM idea_meets
            WHERE idea_meets.ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let projectsMeets: IMeets[] = result[0] as IMeets[];
                    resolve({
                        query: "[ Get meets informations to database ]",
                        status: true,
                        message: "Meets informations getted successfully  ✅",
                        result: projectsMeets,
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Get meets informations to database ]",
                        status: false,
                        message: error.message,
                        result: [],
                    });
                });
        });
    },
    getProjectAttachments(projectId: string): Promise<IGetAttachments[]> {
        return new Promise((resolve, reject) => {
            let sqlQuery: string = `SELECT idea_files.fileId, idea_files.ideaId, idea_files.fileName, idea_files.filePath
            FROM idea_files
            WHERE ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then((result) => {
                    let attachments: IGetAttachments[] = result[0] as IGetAttachments[];
                    // resolve({
                    //     query: "[ Get attachments informations to database ]",
                    //     status: true,
                    //     message: "Attachments informations getted successfully  ✅",
                    //     result: attachments,
                    // });
                    resolve(attachments);
                })
                .catch((error) => {
                    reject({
                        query: "[ Get attachments informations to database ]",
                        status: false,
                        message: error.message,
                        result: [],
                    });
                });
        });
    },
    updatePreviewDatasToDatabase(
        userId: string,
        projectId: string,
        project: IProject
    ): Promise<IUpdateProjectResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `UPDATE ideas
                SET idName = "${project.projectName}", idUnit = "${project.businessUnit}", idGoal = "${project.automatisationMainPurpose}", 
                idDescript = "${project.projectDescription}"
                WHERE ideaId = "${projectId}" AND userId = "${userId}"
            `;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Update preview to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Preview data's updated successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Update preview to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    updateFeasibilityDatasToDatabase(
        userId: string,
        projectId: string,
        project: IProject
    ): Promise<IUpdateProjectResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `UPDATE idea_feasibility
                SET idQ1 = "${project.processRules}", idCom1 = "${project.processRulesComment}", idQ2 = "${project.functionnalProcedure}", idCom2 = "${project.functionnalProcedureComment}", 
                idQ3 = "${project.isDataStructured}", idCom3 = "${project.isDataStructuredComment}", idQ4 = "${project.processStability}", idCom4 = "${project.processStabilityComment}"
                WHERE ideaId = "${projectId}"
            `;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Update feasibility to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Feasibility data's updated successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Update feasibility to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    updatePayoffDatasToDatabase(userId: string, projectId: string, project: IProject): Promise<IUpdateProjectResponse> {
        return new Promise(async (resolve, reject) => {
            switch (true) {
                case project.frequencyOfProcess === "Jour":
                    project.frequencyOfProcess = "d";
                    break;
                case project.frequencyOfProcess === "Semaine":
                    project.frequencyOfProcess = "w";
                    break;
                case project.frequencyOfProcess === "Mois":
                    project.frequencyOfProcess = "m";
                    break;
                case project.frequencyOfProcess === "Projet-campagne":
                    project.frequencyOfProcess = "p-c";
                    break;
                default:
                    break;
            }

            let sqlQuery: string = `UPDATE idea_payoff
                SET idMembers = ${project.numberOfPeopleWorkToThisProcess}, idFreq = "${
                project.frequencyOfProcess
            }", idTreats = ${project.numberOfTreatments}, 
                idDuree = "${project.realisationMediumTime} ${project.realisationMediumTimeSecondPart}", idErrPart = "${
                project.partOfError
            }", idPicAct = "${project.peakOfActivity === "Oui" ? "y" : "n"}", 
                idPicCom = "${project.payOffComment}", idSteps = ${project.processSteps}, idRules = ${
                project.rulesOfDecisionToReachEndOfProcess
            }, 
                idAppUsed = ${project.numberOfApps}, idRemoteApp = "${
                project.appsAccessibilityInRemoteDesktop === "Oui" ? "y" : "n"
            }", 
                idDigitData = "${project.ratialsOfDigitalisedDatas}",  idScanDocs = "${
                project.scanedFiles === "Oui" ? "y" : "n"
            }"
                WHERE ideaId = "${projectId}"
            `;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Update payoff to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Payoff data's updated successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Update payoff to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    updateMeetingDatasToDatabase(
        userId: string,
        projectId: string,
        project: IProject
    ): Promise<IUpdateProjectResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `UPDATE idea_meets
                SET meeting1 = "${project.firstMeet}", meeting2 = "${project.secondMeet}", meeting3 = "${project.thirdMeet}"
                WHERE ideaId = "${projectId}"
            `;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Update meetings to database ]",
                        status: true,
                        projectId: projectId,
                        userId: userId,
                        message: "Meeting data's updated successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Update meetings to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    updateAttachments(
        userId: string,
        projectId: string,
        attachments: Express.Multer.File[]
    ): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            attachments.map((attachment: Express.Multer.File, index: number) => {
                let sqlQuery: string = `UPDATE idea_files
                        SET fileName = "${attachment.filename}", fileType = "${attachment.mimetype}", filePath = "${attachment.path}"
                        WHERE ideaId = "${projectId}"
                    `;

                database
                    .query(sqlQuery)
                    .then(() => {
                        if (((attachments?.length - 1) as number) === index) {
                            resolve({
                                query: "[ Update attachment to database ]",
                                indexOfAttachments: index,
                                status: true,
                                projectId: projectId,
                                userId: "",
                                message: "Attachment data's updated successfully  ✅",
                            });
                        }
                    })
                    .catch((error) => {
                        reject({
                            query: "[ Update attachment to database ]",
                            status: false,
                            code: error.original.code,
                            message: error.message,
                        });
                    });
            });
        });
    },
    deletePreviewDatasToDatabase(projectId: string): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `DELETE FROM ideas WHERE ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Delete preview to database ]",
                        status: true,
                        projectId: projectId,
                        userId: "",
                        message: "Preview data's deleted successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Delete preview to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    deleteFeasabilityDatasToDatabase(projectId: string): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `DELETE FROM idea_feasibility WHERE ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Delete feasibility to database ]",
                        status: true,
                        projectId: projectId,
                        userId: "",
                        message: "Feasibility data's deleted successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Delete feasibility to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    deletePayoffDatasToDatabase(projectId: string): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `DELETE FROM idea_payoff WHERE ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Delete payoff to database ]",
                        status: true,
                        projectId: projectId,
                        userId: "",
                        message: "Payoff data's deleted successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Delete payoff to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    deleteMeetingDatasToDatabase(projectId: string): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `DELETE FROM idea_meets WHERE ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Delete meetings to database ]",
                        status: true,
                        projectId: projectId,
                        userId: "",
                        message: "Meetings data's deleted successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Delete meetings to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    deleteProjectStatus(projectId: string): Promise<ISaveProejctResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `DELETE FROM idea_status WHERE ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then(() => {
                    resolve({
                        query: "[ Delete project status to database ]",
                        status: true,
                        projectId: projectId,
                        userId: "",
                        message: "Project status data's deleted successfully  ✅",
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Delete project status to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
    deleteAttachments(
        userId: string,
        projectId: string,
        attachments: IDeleteAttachment[]
    ): Promise<IUpdateProjectResponse> {
        return new Promise(async (resolve, reject) => {
            if (attachments.length === 0) {
                let folderPath: string = path.join(__dirname + `../../../../public/${userId}/${projectId}`);
                if (fs.existsSync(folderPath)) {
                    fs.rm(folderPath, { recursive: true }, (err) => {
                        if (err) {
                            console.log(err);

                            if (err.message.includes("no such file or directory")) {
                                resolve({
                                    query: "[ Delete attachments to database ]",
                                    status: true,
                                    projectId: projectId,
                                    userId: "",
                                    message: "Folder already deleted",
                                });
                            }

                            reject(err);
                        }

                        resolve({
                            query: "[ Delete attachments to database ]",
                            status: true,
                            projectId: projectId,
                            userId: "",
                            message: "Attachment's folder deleted successfully  ✅",
                        });
                    });
                } else {
                    resolve({
                        query: "[ Delete attachments to database ]",
                        status: true,
                        projectId: projectId,
                        userId: "",
                        message: "No attachments provided",
                    });
                }
            }

            attachments.map((attachment: IDeleteAttachment, index: number) => {
                let sqlQuery: string = `DELETE FROM idea_files WHERE fileId = ${attachment.fileId} AND ideaId = "${projectId}"`;

                database
                    .query(sqlQuery)
                    .then(() => {
                        let folderToDelete: string = attachment.filePath.replace(attachment.fileName, "");

                        fs.rm(folderToDelete, { recursive: true }, (err) => {
                            if (err) {
                                console.log(err);

                                if (err.message.includes("no such file or directory")) {
                                    resolve({
                                        query: "[ Delete attachments to database ]",
                                        status: true,
                                        projectId: projectId,
                                        userId: "",
                                        message: "Attachments already deleted",
                                    });
                                }

                                reject(err);
                            }

                            if (attachments.length - 1 === index) {
                                resolve({
                                    query: "[ Delete attachments to database ]",
                                    status: true,
                                    projectId: projectId,
                                    userId: "",
                                    message: "Attachments deleted successfully  ✅",
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        reject({
                            query: "[ Delete attachments to database ]",
                            status: false,
                            code: error.original.code,
                            message: error.message,
                        });
                    });
            });
        });
    },
    deleteAttachment(projectId: string, fileId: number, filePath: string): Promise<IUpdateProjectResponse> {
        return new Promise(async (resolve, reject) => {
            let sqlQuery: string = `DELETE FROM idea_files WHERE fileId = ${fileId} AND ideaId = "${projectId}"`;

            database
                .query(sqlQuery)
                .then(() => {
                    unlink(filePath, (err) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }

                        resolve({
                            query: "[ Delete attachment to database ]",
                            status: true,
                            projectId: projectId,
                            userId: "",
                            message: "Attachment data's deleted successfully  ✅",
                        });
                    });
                })
                .catch((error) => {
                    reject({
                        query: "[ Delete attachment to database ]",
                        status: false,
                        code: error.original.code,
                        message: error.message,
                    });
                });
        });
    },
};
