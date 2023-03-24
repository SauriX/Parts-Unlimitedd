import { IGeneralForm } from "../models/general";
import {
  IRequestedStudyForm,
  IRequestedStudyList,
  IUpdate,
} from "../models/requestedStudy";
import { IScopes } from "../models/shared";
import requests from "./agent";

const RequestedStudy = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: IGeneralForm): Promise<IRequestedStudyList[]> =>
    requests.post(`requestedstudy/getList`, search),
  update: (update: IUpdate[]): Promise<void> =>
    requests.put("requestedstudy", update),
  getOrderPdf: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`requestedstudy/order/${recordId}/${requestId}`),
  exportList: (search: IRequestedStudyForm): Promise<void> =>
    requests.download(`requestedstudy/export/list`, search),
};

export default RequestedStudy;
