import {QuestionType} from "../forms/Questions/IQuesion";

export interface IQuestionnaireReport {
  questionnaire: IQuestionnaireDto;
  questions: IQuestionReport[];
  excelReportLink?: string;
  pptReportLink?: string;
}

type IQuestionnaireDto = {
    companyName: string;
    id: string;
    questions: QuestionDto[];
    title: string;
}

export type QuestionDto = {
    id: string;
    name: string;
    categoryTitle: string;
    details: any; // will be parsed to object from string
    type: QuestionType;
}

type UserShortDto = {
    id: string;
    username: string;
    // TODO avatar: string;
}

export interface IRequestShort {
    requestId: string;
    targetUser: UserShortDto;
    requestMaker: UserShortDto;
    creationDate: string;
    expirationDate: string;
    generateReport: boolean;
    notifyUsers: boolean;
    closeDate: string;
    userCount: number;
}

export interface IQuestionReport {
  id: string;
  title: string;
  type: QuestionType;
  answers: number;
  data:  // serialized from JSON
  IQuestionReportRadioData |
  IQuestionReportFreeTextData |
  IQuestionReportMultichoiceData |
  IQuestionReportScaleData |
  IQuestionReportFileData;
}

export interface IQuestionReportMultichoiceData {
  options: { title: string; amount: number }[];
}

export interface IQuestionReportRadioData {
  options: { title: string; amount: number }[];
}

export interface IRespondentReportPreview {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  answeredAt: string;
}

export interface IQuestionReportScaleData {
  options: { title: string; amount: number }[];
}

export interface IQuestionReportFreeTextData {
  values: string[];
}

export interface IQuestionReportCheckboxData {
  options: { title: string; amount: number }[];
}

export interface IQuestionReportDateData {
  options: { title: string; amount: number }[];
}

export interface IQuestionReportFileData {
  options: { type: string; amount: number; sizes: number[] }[];
}
