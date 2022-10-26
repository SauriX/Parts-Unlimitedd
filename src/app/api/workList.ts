import { IWorkListFilter } from "../models/workList";
import requests from "./agent";

const WorkList = {
  getWorkListPdfUrl: (filter: IWorkListFilter): Promise<string> =>
    requests.getFileUrl(`workList/print`, "application/pdf", filter),
};

export default WorkList;
