import { Irelacelist, ISearchRelase } from "../models/relaseresult";
import {  IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import requests from "./agent";

const ResultRelase = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: ISearchRelase): Promise<Irelacelist[]> =>
    requests.post(`ResultValidation/getList`, search),
  update: (update: IUpdate[]): Promise<void> => requests.put("ResultValidation", update),
  getresultPdf: (listResults: any): Promise<void> =>
    requests.print  (`ResultValidation/view/list`,listResults),
    getOrderPdf: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`ResultValidation/order/${recordId}/${requestId}`),
    exportList: (search: ISearchRelase): Promise<void> =>
    requests.download(`ResultValidation/export/list`, search), //, "Catálogo de Sucursales.xlsx"
};

export default ResultRelase;
