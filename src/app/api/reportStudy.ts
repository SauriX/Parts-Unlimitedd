import { IGeneralForm } from "../models/general";
import { IReportRequestInfo } from "../models/ReportRequest";
import requests from "./agent";

const ReportStudy = {
  getRequests: (filter: IGeneralForm): Promise<IReportRequestInfo[]> =>
    requests.post("ReportStudy/filter", filter),
  printPdf: (filter: IGeneralForm): Promise<void> =>
    requests.print(`ReportStudy/report`, filter),
  downloadList: (filter: IGeneralForm): Promise<void> =>
    requests.download(`ReportStudy/export/getList`, filter),
};

export default ReportStudy;
