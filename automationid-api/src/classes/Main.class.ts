import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectionToDatabase } from "../database/database.connection";
import { healthCheckRoute } from "../routes/healthCheck/healthCheckRoute";
import { projectRoute } from "../routes/project/projectRoute";
import dotenv from "dotenv";
import compression from "compression";
import { authRoute } from "../routes/auth/authRoute";
import { userRoute } from "../routes/user/userRoute";
dotenv.config();

export default class Main {
    constructor(private _router: Express, private _port?: number) {
        this._port = parseInt(String(process.env.SERVER_PORT));
    }

    initialization(): void {
        // this._router.use(bodyParser.urlencoded({ extended: false }));
        this._router.use(bodyParser.json());
        this._router.use(cors());
        this._router.use(
            compression({
                level: 6,
                threshold: 10 * 1000,
                filter: (req, res) => {
                    if (req.headers["x-no-compression"]) {
                        return false;
                    }
                    return compression.filter(req, res);
                },
            })
        );
        this._router.use("/automationid/api", healthCheckRoute);
        this._router.use("/automationid/api", authRoute);
        this._router.use("/automationid/api", projectRoute);
        this._router.use("/automationid/api", userRoute);
    }

    startServer(): Promise<object> {
        return new Promise(async (resolve, reject) => {
            await this.initialization();

            this._router.listen(this._port, async () => {
                resolve({
                    serverStatus: 200,
                    message: `Server ${process.pid} running on port ${this._port} ✅`,
                    databaseConnectionStatus: await connectionToDatabase(),
                });
            });
        });
    }
}
