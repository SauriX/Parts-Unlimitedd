import { ISearchMedical } from "../models/Proceeding";
import { IsamplingForm, IsamplingList, IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Sampling = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: IsamplingForm): Promise<IsamplingList[]> =>
    requests.post(`sampling/getList`, search),
  update: (update: IUpdate[]): Promise<void> =>
    requests.put("sampling", update),
  getOrderPdf: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`sampling/order/${recordId}/${requestId}`),
  exportList: (search: ISearchMedical): Promise<void> =>
    requests.download(`sampling/export/getList`, search),
};

export default Sampling;
