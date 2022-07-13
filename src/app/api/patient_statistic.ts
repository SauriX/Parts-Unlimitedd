import {IPatientStatisticForm, IPatientStatisticList} from "../models/patient_statistic";
import { IScopes } from "../models/shared";
import requests from "./agent";

const PatientStatistic = {
    getAll: (reportName: string, search?: string): Promise<IPatientStatisticList[]> => 
    requests.get(`report/${reportName}/all${!search ? "all" : search}`),
    getByName: (): Promise<IPatientStatisticList[]> => requests.get(`patientstats/getByName`),
    access: (): Promise<IScopes> => requests.get("scopes/patientstats"),
    filtro: (search:IPatientStatisticForm): Promise<IPatientStatisticList[]> => requests.post(`patientstats/filter`, search??{}),
    printPdf: (): Promise<void> => requests.download(`patientstats/download/pdf`),
    exportList: (reportName: string, search: string): Promise<void> =>
    requests.download(`report/${reportName}/export/list/${!search ? "all" : search}`),
    exportForm: (id: string): Promise<void> => requests.download(`report/export/form/${id}`),
}

export default PatientStatistic;