import {IPatientStatisticForm, IPatientStatisticList} from "../models/patient_statistic";
import { IScopes } from "../models/shared";
import requests from "./agent";

const PatientStatistic = {
    getAll: (reportName: string, search?: string): Promise<IPatientStatisticList[]> => 
    requests.get(`report/${reportName}/all${!search ? "all" : search}`),
    getBranchByCount: (): Promise<IPatientStatisticList[]> => requests.get(`request/getBranchByCount`),
    access: (): Promise<IScopes> => requests.get("scopes/request"),

    filtro: (search:IPatientStatisticForm): Promise<IPatientStatisticList[]> => requests.post(`request/filter`, search??{}),
    exportList: (reportName: string, search: string): Promise<void> =>
    requests.download(`report/${reportName}/export/list/${!search ? "all" : search}`),
    exportForm: (id: string): Promise<void> => requests.download(`report/export/form/${id}`),
}

export default PatientStatistic;