import { IReportForm, IReportList, IReportTable } from "../models/report";
import { IScopes } from "../models/shared";
import requests from "./agent";


const Report = {
    getAll: (reportName: string, search?: string): Promise<IReportList[]> =>
    requests.get(`report/${reportName}/all/${!search ? "all" : search}`),
    getBranchByCount: (): Promise<IReportList[]> => requests.get(`request/getBranchByCount`),
    access: (): Promise<IScopes> => requests.get("scopes/report"),
    // filtro: (reportName: IReportForm): Promise<void> => requests.post("report", reportName),
    filtro: (search:IReportForm): Promise<IReportList[]> => requests.post(`report/now`,search??{}),
    // create: (reportName: string, report: IReportForm): Promise<IReportForm> => requests.post(`report/${reportName}`, report),
    exportList: (reportName: string, search: string): Promise<void> =>
    requests.download(`report/${reportName}/export/list/${!search ? "all" : search}`),
    exportForm: (id: string): Promise<void> => requests.download(`report/export/form/${id}`),
};

export default Report;
