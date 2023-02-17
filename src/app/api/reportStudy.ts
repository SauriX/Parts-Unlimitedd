import { IReportRequestInfo } from "../models/ReportRequest";
import { IRequestFilter } from "../models/request";
import requests from "./agent";

  
  const ReportStudy = {
    getRequests: (filter: IRequestFilter): Promise<IReportRequestInfo[]> =>
      requests.post("ReportStudy/filter", filter),
   
    printPdf: (filter: IRequestFilter): Promise<void> =>
      requests.print(`ReportStudy/report`,filter),
    downloadList:(filter: IRequestFilter): Promise<void> =>
    requests.download(`ReportStudy/export/getList`,filter),
  };
  
  export default ReportStudy;
  