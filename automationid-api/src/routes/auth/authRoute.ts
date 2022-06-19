import express, { Router } from "express";
import { ConfirmedMailController } from "../../controllers/auth/ConfirmedMailController";
import { EditUserProfileController } from "../../controllers/auth/EditUserProfileController";
import { SigninController } from "../../controllers/auth/SigninController";
import { SignupController } from "../../controllers/auth/SignupController";
import { verifyToken } from "../../middlewares/verifyToken";

const authRoute: Router = express.Router();

authRoute.post("/signup", SignupController);
authRoute.post("/signin", SigninController);
authRoute.post("/confirmed-mail/:id", ConfirmedMailController);
authRoute.post("/edit-profile/:userId", [verifyToken], EditUserProfileController);
authRoute.patch("/forgot-password/:userId");

export { authRoute };
