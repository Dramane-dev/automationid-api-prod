import { IFeasibility } from "../data/IFeasibility";
import { IMeets } from "../data/IMeets";
import { IPayoff } from "../data/IPayoff";
import { IPreview } from "../data/IPreview";
import { IProject } from "../data/IProject";
import { IProjectInDatabase } from "../data/IProjectInDataBase";

export interface IGetProjects {
    userId?: string;
    projectId?: string;
    query: string;
    status: boolean;
    message: string;
    result: IProject[] | IProjectInDatabase[] | IPreview[] | IFeasibility[] | IPayoff[] | IMeets[];
}
