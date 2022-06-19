import { Request, Response } from "express";
import { IServerStatus } from "../../interfaces/health/IServerStatus";
import moment from "moment";

// Vérifie l'état du serveur
export const HealthCheckController = (req: Request, res: Response) => {
    const serverStatus: IServerStatus = {
        serverIsRunningSince: process.uptime(),
        serverConnected: process.connected,
        message: "Ok",
        date: moment().format("DD/MM/YYYY HH:mm:ss").toString(),
    };

    res.status(200).send(serverStatus);
};

export const ChargeRequestTest = (req: Request, res: Response) => {
    let strResponse: string = "This is a charge test";
    res.send(strResponse.repeat(10000));
};
