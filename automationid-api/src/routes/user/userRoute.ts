import express, { Router } from "express";

const userRoute: Router = express.Router();
userRoute.get("/users");
userRoute.get("/user/:id");

export { userRoute };
