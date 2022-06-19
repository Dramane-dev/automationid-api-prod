export interface IUpdateProjectResponse {
    query: string;
    indexOfAttachments?: number;
    status: boolean;
    projectId: string;
    userId: string;
    code?: string;
    message?: string;
}
