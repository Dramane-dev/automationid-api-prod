import { Request, Response } from "express";
import { generateAccessToken } from "../../functions/auth/generateToken";
import { IUser } from "../../interfaces/auth/IUser";
import { User } from "../../models/auth/User.model";
import { GetUserByIdController } from "./GetUserByIdController";

export const ConfirmedMailController = async (req: Request, res: Response) => {
    console.log("[ USER MAIL CODE VERIFICATION FROM FRONTEND! ]");
    console.log(req.body);

    let userId: string = req.params.id;
    let mailVerificationCode: string = req.body.mailVerificationCode;
    let actualUser: IUser = await GetUserByIdController(userId);

    if (mailVerificationCode === actualUser.key && actualUser.key !== null) {
        User.update(
            {
                accountValid: "y",
            },
            {
                where: {
                    userId: userId,
                },
            }
        )
            .then(async (result) => {
                let user: IUser = await GetUserByIdController(userId);
                user.accessToken = await generateAccessToken(actualUser.userId as string);

                return res.status(200).send({
                    status: 200,
                    message: "Votre email à bien été vérifié ✅ !",
                    user: user,
                });
            })
            .catch((error) => {
                return res.send({
                    message: "Erreur de saisie du code ❌ . Veuillez réessayer à nouveau.",
                });
            });
    } else {
        return res.status(400).send({
            status: 400,
            message: "Erreur de saisie du code ❌ . Veuillez réessayer à nouveau.",
        });
    }
};
