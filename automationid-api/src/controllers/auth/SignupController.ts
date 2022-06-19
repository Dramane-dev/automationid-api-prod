import { User } from "../../models/auth/User.model";
import { Request, Response } from "express";
import { IUser } from "../../interfaces/auth/IUser";
import { passwordConfirmed } from "../../functions/auth/passwordConfirmed";
import { mailRestriction } from "../../functions/auth/mailRestriction";
import argon2 from "argon2";
import { sendMailVerification } from "../../functions/auth/sendMailVerification";
import { ValidationKeys } from "../../models/auth/ValidationKey.model";
import { generateMailCodeVerification } from "../../functions/auth/generateMailCodeVerification";
import { generateId } from "../../functions/generateId";

export const SignupController = async (req: Request, res: Response) => {
    let password: string = req.body.userPass;
    let confirmedPassword: string = req.body.confirmedPassword;
    let isSamePassword: boolean = passwordConfirmed(password, confirmedPassword);

    if (isSamePassword && mailRestriction(req.body.userMail)) {
        User.create({
            userId: generateId("USR"),
            userNom: req.body.userNom,
            userPrenom: req.body.userPrenom,
            userGenre: req.body.userGenre,
            userMail: req.body.userMail.toLowerCase(),
            userPass: await argon2.hash(req.body.userPass),
        })
            .then(async (result) => {
                let user: IUser = {
                    userId: result.getDataValue("userId"),
                    userType: result.getDataValue("userType"),
                    userNom: result.getDataValue("userNom"),
                    userPrenom: result.getDataValue("userPrenom"),
                    userGenre: result.getDataValue("userGenre"),
                    userMail: result.getDataValue("userMail"),
                    userPass: result.getDataValue("userPass"),
                    userCreat: result.getDataValue("userCreat"),
                    accountValid: result.getDataValue("accountValid"),
                };

                ValidationKeys.create({
                    userId: user.userId,
                    key: generateMailCodeVerification(),
                    keyType: "mailConfirm",
                }).then((validationKeysResult) => {
                    user.key = validationKeysResult.getDataValue("key");

                    sendMailVerification(user)
                        .then((result) => {
                            user.key = "";
                            user.userPass = "";

                            if (result.status === "OK") {
                                return res.status(200).send({
                                    status: 200,
                                    message: "User created successfully ✅ !",
                                    mailVerification: result,
                                    user: user,
                                });
                            } else {
                                return res.status(500).send({
                                    status: 500,
                                    message: "Le mail de vérification n'a pus être envoyé ❌ ",
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return res.send({
                                message: error.message,
                            });
                        });
                });
            })
            .catch((error) => {
                if (error.original.code.includes("DUP_ENTRY")) {
                    return res.status(401).send({
                        status: 401,
                        message: "Vous possédez déjà un compte ❌ ",
                    });
                } else {
                    return res.send({
                        message: error.message,
                    });
                }
            });
    } else {
        if (!mailRestriction(req.body.userMail)) {
            return res.status(400).send({
                status: 400,
                message: "Vous devez renseigner une adresse mail Foncia !",
            });
        }

        return res.status(400).send({
            status: 400,
            message: "Tous les champs sont requis !",
        });
    }
};
