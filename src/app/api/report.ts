import { IReportList } from "../models/report";
import { IScopes } from "../models/shared";
import requests from "./agent";


const Report = {
    getAll: (reportName: string, search?: string): Promise<IReportList[]> =>
    requests.get(`report/${reportName}/all/${!search ? "all" : search}`),
    access: (): Promise<IScopes> => requests.get("scopes/report"),
    exportList: (reportName: string, search: string): Promise<void> =>
    requests.download(`report/${reportName}/export/list/${!search ? "all" : search}`),
    exportForm: (id: string): Promise<void> => requests.download(`report/export/form/${id}`),
};

export default Report;
