import express, { Router } from "express";
import multer, { StorageEngine } from "multer";
import { ProjectController } from "../../controllers/project/ProjectController";
import fs from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { verifyToken } from "../../middlewares/verifyToken";

const projectRoute: Router = express.Router();
const storage: StorageEngine = multer.diskStorage({
    destination: async (req, file, callback) => {
        let userId: string = req.params.userId;
        let projectId: string = req.params.projectId;
        // fs.mkdir(path.join(__dirname, `../../../public/${userId}/${projectId}`), { recursive: true });
        mkdir(path.join(__dirname, `../../../public/${userId}/${projectId}`), { recursive: true })
            .then(() => {
                let attachementsPath: string = path.join(__dirname, `../../../public/${userId}/${projectId}`);
                callback(null, attachementsPath);
            })
            .catch((error) => {
                console.log(error);
            });
    },
    filename: (req, file, callback) => {
        let userId: string = req.params.userId;
        let projectId: string = req.params.projectId;
        const name = `${projectId}-${file.originalname.split(" ").join("_")}`;
        callback(null, name);
    },
});
const uploads = multer({ storage });

projectRoute.get("/all/home/projects/:userId", [verifyToken], ProjectController.getAllHomeProjects);
projectRoute.get("/all/projects", [verifyToken], ProjectController.getAllProjects);
projectRoute.get("/all/projects/:userId", [verifyToken], ProjectController.getAllProjectsByUserId);
projectRoute.get(
    "/projects/step-by-step/:projectId",
    [verifyToken],
    ProjectController.getAllProjectsStepByStepByUserId
);
projectRoute.get("/project/:projectId");
projectRoute.get("/projects-cards/", [verifyToken], ProjectController.getProjectInformationsToCards);
projectRoute.get("/projects-cards/:userId", [verifyToken], ProjectController.getProjectInformationsToCardsById);
projectRoute.get("/attachments/:projectId", [verifyToken], ProjectController.getAttachmentsByProjectId);
projectRoute.post("/project/:userId", [verifyToken], ProjectController.createProject);
projectRoute.post(
    "/upload-attachment/:userId/:projectId",
    [verifyToken],
    uploads.array("attachments"),
    ProjectController.uploadFile
);
projectRoute.post("/send-project/:projectId", [verifyToken], ProjectController.sendProjectByProjectId);
projectRoute.put("/project/:userId/:projectId", [verifyToken], ProjectController.updateProject);
projectRoute.delete("/project/:userId/:projectId", [verifyToken], ProjectController.deleteProject);
projectRoute.delete("/attachment/:projectId/:fileId", [verifyToken], ProjectController.deleteAttachment);
export { projectRoute };
