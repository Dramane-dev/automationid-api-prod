import { IProjectInformationsToCards } from "./IProjectInformationsToCards";

export interface IGetProjectInformationsToCardsResponse {
    query: string;
    status: boolean;
    message: string;
    result?: IProjectInformationsToCards[];
}
