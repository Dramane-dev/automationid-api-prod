export interface IUser {
    userId?: string;
    userType?: string;
    userNom: string;
    userPrenom: string;
    userGenre: string;
    userMail: string;
    userPass: string;
    userCreat?: Date;
    accountValid?: boolean;
    key?: string;
    keyType?: string;
    accessToken?: string;
}
