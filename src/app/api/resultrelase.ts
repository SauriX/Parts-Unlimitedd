import { IGeneralForm } from "../models/general";
import { Irelacelist } from "../models/relaseresult";
import {  IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import requests from "./agent";

const ResultRelase = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: IGeneralForm): Promise<Irelacelist[]> =>
    requests.post(`RelaseResult/getList`, search),
  update: (update: IUpdate[]): Promise<void> => requests.put("RelaseResult", update),
  getresultPdf: (listResults: any): Promise<void> =>
    requests.print  (`RelaseResult/view/list`,listResults),
    getOrderPdf: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`RelaseResult/order/${recordId}/${requestId}`),
    exportList: (search: IGeneralForm): Promise<void> =>
    requests.download(`RelaseResult/export/list`, search), //, "Catálogo de Sucursales.xlsx"
};

export default ResultRelase;
