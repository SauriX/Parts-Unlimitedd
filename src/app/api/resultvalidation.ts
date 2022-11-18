import { ISearchValidation, Ivalidationlist } from "../models/resultValidation";
import {  IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import requests from "./agent";

const ResultValidation = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: ISearchValidation): Promise<Ivalidationlist[]> =>
    requests.post(`ResultValidation/getList`, search),
  update: (update: IUpdate[]): Promise<void> => requests.put("ResultValidation", update),
  getresultPdf: (listResults: any): Promise<void> =>
    requests.print  (`ResultValidation/view/list`,listResults),
    getOrderPdf: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`ResultValidation/order/${recordId}/${requestId}`),
};

export default ResultValidation;
