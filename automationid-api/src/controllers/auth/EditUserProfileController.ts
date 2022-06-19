import { Request, Response } from "express";
import { passwordConfirmed } from "../../functions/auth/passwordConfirmed";
import { mailRestriction } from "../../functions/auth/mailRestriction";
import argon2 from "argon2";
import { ValidationKeys } from "../../models/auth/ValidationKey.model";
import { generateMailCodeVerification } from "../../functions/auth/generateMailCodeVerification";
import { User } from "../../models/auth/User.model";
import { IUser } from "../../interfaces/auth/IUser";
import { sendMailVerification } from "../../functions/auth/sendMailVerification";
import { verifyPassword } from "../../functions/auth/verifyPassword";

export const EditUserProfileController = async (req: Request, res: Response) => {
    let userId: string = req.params.userId;
    let oldPassword: string = req.body.userPass;
    let password: string = req.body.newUserPass;
    let confirmedPassword: string = req.body.confirmedPassword;
    let isSamePassword: boolean = passwordConfirmed(password, confirmedPassword);
    let userMailIsChanged: boolean = false;
    let oldPasswordAndOldPasswordFromDbAreSame: boolean = false;

    User.findOne({
        where: {
            userId: userId,
        },
    })
        .then(async (user) => {
            userMailIsChanged = user?.getDataValue("userMail").toLowerCase() !== req.body.userMail.toLowerCase();
            oldPasswordAndOldPasswordFromDbAreSame = await verifyPassword(user?.getDataValue("userPass"), oldPassword);

            if (isSamePassword && mailRestriction(req.body.userMail) && oldPasswordAndOldPasswordFromDbAreSame) {
                User.update(
                    {
                        userNom: req.body.userNom,
                        userPrenom: req.body.userPrenom,
                        userGenre: req.body.userGenre,
                        userMail: req.body.userMail,
                        userPass: await argon2.hash(req.body.newUserPass),
                    },
                    {
                        where: {
                            userId: userId,
                        },
                    }
                )
                    .then(async () => {
                        return "User profile updated successfully ✅";
                    })
                    .then((result) => {
                        console.log(result);

                        User.findOne({
                            where: {
                                userId: userId,
                            },
                        })
                            .then((usr) => {
                                let user: IUser = {
                                    userId: usr?.getDataValue("userId"),
                                    userType: usr?.getDataValue("userType"),
                                    userNom: usr?.getDataValue("userNom"),
                                    userPrenom: usr?.getDataValue("userPrenom"),
                                    userGenre: usr?.getDataValue("userGenre"),
                                    userMail: usr?.getDataValue("userMail"),
                                    userPass: usr?.getDataValue("userPass"),
                                    userCreat: usr?.getDataValue("userCreat"),
                                    accountValid: usr?.getDataValue("accountValid"),
                                };

                                if (userMailIsChanged) {
                                    ValidationKeys.create({
                                        userId: user.userId,
                                        key: generateMailCodeVerification(),
                                        keyType: "mailConfirm",
                                    })
                                        .then((validationKeysResult) => {
                                            user.key = validationKeysResult.getDataValue("key");

                                            sendMailVerification(user)
                                                .then((result) => {
                                                    user.key = "";
                                                    user.userPass = "";

                                                    if (result.status === "OK") {
                                                        return res.status(200).send({
                                                            status: 200,
                                                            message: "Votre profile a été mis à jour ✅ !",
                                                            mailVerification: result,
                                                            userMailChanged: true,
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
                                        })
                                        .catch((error) => {
                                            return res.status(401).send({
                                                status: 401,
                                                message: "Vous possédez déjà cette adresse mail !",
                                            });
                                        });
                                } else {
                                    return res.status(200).send({
                                        status: 200,
                                        message: "Votre profile a été mis à jour ✅ !",
                                        userMailChanged: false,
                                        user: user,
                                    });
                                }
                            })
                            .catch((error) => {
                                return res.status(404).send({
                                    status: 404,
                                    message: "User doesn't exist ❌",
                                });
                            });
                    })
                    .catch((error) => {
                        return res.status(500).send({
                            status: 500,
                            message: "Une erreur est survenue lors de la modification de votre profil...",
                        });
                    });
            } else {
                if (!mailRestriction(req.body.userMail)) {
                    return res.status(401).send({
                        status: 401,
                        message: "Vous devez renseigner une adresse mail Foncia !",
                    });
                }

                switch (true) {
                    case !isSamePassword:
                        return res.status(400).send({
                            status: 400,
                            message: "Vos mots de passe doivent être identique !",
                        });
                    case !mailRestriction(req.body.userMail):
                        return res.status(400).send({
                            status: 400,
                            message: "Vous devez saisir une adresse mail Foncia !",
                        });
                    case !oldPasswordAndOldPasswordFromDbAreSame:
                        return res.status(400).send({
                            status: 400,
                            message: "Mot de passe incorrect !",
                        });
                    default:
                        return res.status(400).send({
                            status: 400,
                            message: "Tous les champs sont requis !",
                        });
                }
            }
        })
        .catch((error) => {
            return res.status(404).send({
                status: 404,
                message: "User doesn't exist",
            });
        });
};
