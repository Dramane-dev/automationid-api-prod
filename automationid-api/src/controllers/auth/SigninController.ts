import { Request, Response } from "express";
import { generateAccessToken } from "../../functions/auth/generateToken";
import { verifyPassword } from "../../functions/auth/verifyPassword";
import { User } from "../../models/auth/User.model";

export const SigninController = (req: Request, res: Response) => {
    let password: string = req.body.userPass;

    User.findOne({
        where: {
            userMail: req.body.userMail.toLowerCase(),
        },
    })
        .then(async (user) => {
            if (!user || !password) {
                return res.status(404).send({
                    message: "Votre adresse Email ou mot de passe est incorrecte !",
                });
            }

            let userHasConfirmedMail: boolean = user?.getDataValue("accountValid") === "y";

            if (!userHasConfirmedMail) {
                return res.status(401).send({
                    status: 401,
                    message: "Votre email doit être vérifié avant de vous connecter !",
                });
                // throw new Error("Votre email doit être vérifié avant de vous connecter !");
            }

            let isValidPassword: boolean = await verifyPassword(user?.getDataValue("userPass"), password);

            if (!user || !isValidPassword) {
                return res.status(404).send({
                    status: 404,
                    message: "Email ou mot de passe invalide ❌ !",
                });
            }

            let userId: string = user.getDataValue("userId");
            let token: string = await generateAccessToken(userId);

            user.setDataValue("accessToken", token);

            res.status(200).send({
                status: 200,
                message: "Utilisateur connecté avec succès ✅ !",
                user: user,
            });
        })
        .catch((error) => {
            return res.status(404).send({
                status: 404,
                message: error.message,
            });
        });
};
