import { IAttachment } from "../request/IAttachment";

export interface IProject {
    projectName: string;
    peopleToContact: string;
    businessUnit: string;
    automatisationMainPurpose: string;
    projectDescription: string;
    attachments: IAttachment[];
    processRules: string;
    processRulesComment: string;
    functionnalProcedure: string;
    functionnalProcedureComment: string;
    isDataStructured: string;
    isDataStructuredComment: string;
    processStability: string;
    processStabilityComment: string;
    numberOfPeopleWorkToThisProcess: number;
    frequencyOfProcess: string;
    numberOfTreatments: number;
    realisationMediumTime: string;
    realisationMediumTimeSecondPart: string;
    partOfError: string;
    peakOfActivity: string;
    payOffComment: string;
    processSteps: number;
    rulesOfDecisionToReachEndOfProcess: number;
    numberOfApps: number;
    appsAccessibilityInRemoteDesktop: string;
    ratialsOfDigitalisedDatas: string;
    scanedFiles: string;
    firstMeet: string;
    secondMeet: string;
    thirdMeet: string;
}
