import { Request, Response } from "express";
import { IProject } from "../../interfaces/data/IProject";
import { ProjectQuerys } from "../../functions/project/ProjectQuerys";
import { sendProjectNotification } from "../../functions/project/sendProjectNotification";
import { IDeleteAttachment } from "../../interfaces/request/IDeleteAttachment";
import { IProjectInDatabase } from "../../interfaces/data/IProjectInDataBase";

export const ProjectController = {
    getAllHomeProjects(req: Request, res: Response) {
        let userId: string = req.params.userId;
        const { getAllProjectsInformations, getAllProjectsInformationsByUserId } = ProjectQuerys;

        Promise.all([getAllProjectsInformations(), getAllProjectsInformationsByUserId(userId)])
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((error) => {
                res.status(404).send(error);
            });
    },
    getAllProjects(req: Request, res: Response) {
        ProjectQuerys.getAllProjectsInformations()
            .then((result) => {
                console.log(result.message);
                res.status(200).send(result);
            })
            .catch((error) => {
                console.log(error.message);
                res.status(404).send(error);
            });
    },
    getAllProjectsByUserId(req: Request, res: Response) {
        let userId: string = req.params.userId;
        ProjectQuerys.getAllProjectsInformationsByUserId(userId)
            .then((result) => {
                console.log(result.message);
                res.status(200).send(result);
            })
            .catch((error) => {
                res.status(404).send(error);
            });
    },
    getAllProjectsStepByStepByUserId(req: Request, res: Response) {
        const {
            getProjectsPreviewByUserIdAndProjectId,
            getProjectFeasibilityByUserIdAndProjectId,
            getProjectPayoffByUserIdAndProjectId,
            getProjectMeetsByUserIdAndProjectId,
        } = ProjectQuerys;
        let projectId: string = req.params.projectId;

        Promise.all([
            getProjectsPreviewByUserIdAndProjectId(projectId),
            getProjectFeasibilityByUserIdAndProjectId(projectId),
            getProjectPayoffByUserIdAndProjectId(projectId),
            getProjectMeetsByUserIdAndProjectId(projectId),
        ])
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((error) => {
                res.send(error);
            });
    },
    getProjectInformationsToCards(req: Request, res: Response) {
        ProjectQuerys.getProjectsInformationsToCards()
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((error) => {
                res.status(404).send(error);
            });
    },
    getProjectInformationsToCardsById(req: Request, res: Response) {
        let userId: string = req.params.userId;
        ProjectQuerys.getProjectsInformationsToCardsById(userId)
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((error) => {
                res.status(404).send(error);
            });
    },
    getAttachmentsByProjectId(req: Request, res: Response) {
        let projectId: string = req.params.projectId;

        ProjectQuerys.getProjectAttachments(projectId)
            .then((result) => {
                return res.status(200).send(result);
            })
            .catch((error) => {
                return res.status(404).send(error);
            });
    },
    createProject(req: Request, res: Response) {
        let userId: string = req.params.userId;
        let project: IProject = req.body;

        // let project: IProject = req.body.project;
        // let attachments: Express.Multer.File[] = req.body.files as Express.Multer.File[];

        // .then(async (result) => {
        //     console.log(result.message);
        //     return await ProjectQuerys.saveAttachments(userId, result.projectId, attachments);
        // })
        ProjectQuerys.savePreviewDatasToDatabase(userId, project)
            .then((result) => {
                return result;
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.saveFeasabilityDatasToDatabase(result.userId, result.projectId, project);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.savePayoffDatasToDatabase(result.userId, result.projectId, project);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.saveMeetingDatasToDatabase(result.userId, result.projectId, project);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.saveProjectStatus(result.userId, result.projectId);
            })
            .then((result) => {
                console.log(result.message);
                res.status(200).send({
                    projectId: result.projectId,
                    message: "Idée enregistrée avec succès ✅",
                });
            })
            .catch((error) => {
                res.send({
                    message: error.message,
                });
            });
    },
    uploadFile(req: Request, res: Response) {
        let attachments: Express.Multer.File[] = req.files as Express.Multer.File[];
        let userId: string = req.params.userId;
        let projectId: string = req.params.projectId;

        if (attachments) {
            if ((attachments?.length as number) > 0) {
                ProjectQuerys.saveAttachments(userId, projectId, attachments)
                    .then((result) => {
                        return result;
                    })
                    .then((result) => {
                        console.log(result.message);
                        res.status(200).end();
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send({
                            message: error.message,
                        });
                    });
            }
        } else {
            res.status(200).end();
        }
    },
    sendProjectByProjectId(req: Request, res: Response) {
        let projectId: string = req.params.projectId;
        let project: IProjectInDatabase = req.body.project;

        sendProjectNotification(projectId, project)
            .then((result) => {
                res.status(200).send({
                    status: result.status,
                    message: result.message,
                });
            })
            .catch((error) => {
                console.log(error);
                // const { data, status } = error.response;
                res.send(error);
            });
    },
    updateProject(req: Request, res: Response) {
        let userId: string = req.params.userId;
        let projectId: string = req.params.projectId;
        let project: IProject = req.body;

        ProjectQuerys.updatePreviewDatasToDatabase(userId, projectId, project)
            .then((result) => {
                return result;
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.updateFeasibilityDatasToDatabase(result.userId, result.projectId, project);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.updatePayoffDatasToDatabase(result.userId, result.projectId, project);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.updateMeetingDatasToDatabase(result.userId, result.projectId, project);
            })
            .then((result) => {
                console.log(result.message);

                res.status(200).send({
                    projectId: result.projectId,
                    message: "Projet enregistré avec succès ✅",
                });
            })
            .catch((error) => {
                return res.send({
                    message: error.message,
                });
            });
    },
    deleteProject(req: Request, res: Response) {
        let userId: string = req.params.userId;
        let projectId: string = req.params.projectId;
        let attachments: IDeleteAttachment[] = req.body.attachments;

        ProjectQuerys.deletePreviewDatasToDatabase(projectId)
            .then((result) => {
                return result;
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.deleteFeasabilityDatasToDatabase(result.projectId);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.deletePayoffDatasToDatabase(result.projectId);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.deleteMeetingDatasToDatabase(result.projectId);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.deleteProjectStatus(result.projectId);
            })
            .then(async (result) => {
                console.log(result.message);
                return await ProjectQuerys.deleteAttachments(userId, result.projectId, attachments);
            })
            .then((result) => {
                console.log(result.message);
                res.status(200).send({
                    projectId: result.projectId,
                    message: "Projet enregistré avec succès ✅",
                });
            })
            .catch((error) => {
                res.send({
                    message: error.message,
                });
            });
    },
    deleteAttachment(req: Request, res: Response) {
        let projectId: string = req.params.projectId;
        let fileId: number = parseInt(req.params.fileId);
        let filePath: string = req.body.filePath;

        ProjectQuerys.deleteAttachment(projectId, fileId, filePath)
            .then(async (result) => {
                console.log(result.message);
                return res.status(200).send({
                    message: "Pièce jointe supprimé avec succès ✅",
                });
            })
            .catch((error) => {
                return res.send({
                    message: error.message,
                });
            });
    },
};
