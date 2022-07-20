import { IReportForm, IReportList, IReportTable } from "../models/report";
import { IScopes } from "../models/shared";
import requests from "./agent";


const Report = {
    getAll: (reportName: string, search?: string): Promise<IReportList[]> =>
    requests.get(`report/${reportName}/all/${!search ? "all" : search}`),
    getBranchByCount: (): Promise<IReportList[]> => requests.get(`report/expediente/getAll`),
    access: (): Promise<IScopes> => requests.get("scopes/request"),
    // filtro: (reportName: IReportForm): Promise<void> => requests.post("report", reportName),
    filtro: (search:IReportForm): Promise<IReportList[]> => requests.post(`report/expediente/filter`,search??{}),
    printPdf: (search?:IReportForm): Promise<void> => requests.download(`report/expediente/download/pdf`,search??{}),
    // create: (reportName: string, report: IReportForm): Promise<IReportForm> => requests.post(`report/${reportName}`, report),
    exportList: (reportName: string, search: string): Promise<void> =>
    requests.download(`report/expediente/${reportName}/export/list/${!search ? "all" : search}`),
    exportForm: (id: string): Promise<void> => requests.download(`report/expediente/export/form/${id}`),
};

export default Report;
