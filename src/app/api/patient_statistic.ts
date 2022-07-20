import {IPatientStatisticForm, IPatientStatisticList} from "../models/patient_statistic";
import { IScopes } from "../models/shared";
import requests from "./agent";

const PatientStatistic = { 
    getAll: (reportName: string, search?: string): Promise<IPatientStatisticList[]> => 
    requests.get(`report/${reportName}/all${!search ? "all" : search}`),
    getByName: (): Promise<IPatientStatisticList[]> => requests.get(`report/estadistica/getAll`),
    access: (): Promise<IScopes> => requests.get("scopes/patientstats"),
    filtro: (search:IPatientStatisticForm): Promise<IPatientStatisticList[]> => requests.post(`report/estadistica/filter`, search??{}),
    printPdf: (search?:IPatientStatisticForm): Promise<void> => requests.download(`report/estadistica/download/pdf`, search??{}),
    exportList: (reportName: string, search: string): Promise<void> =>
    requests.download(`report/estadistica/${reportName}/export/list/${!search ? "all" : search}`),
    exportForm: (id: string): Promise<void> => requests.download(`report/estadistica/export/form/${id}`),
}

export default PatientStatistic;