import { IGeneralForm } from "../models/general";
import { Ivalidationlist } from "../models/resultValidation";
import { IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import requests from "./agent";

const ResultValidation = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: IGeneralForm): Promise<Ivalidationlist[]> =>
    requests.post(`ResultValidation/getList`, search),
  update: (update: IUpdate[]): Promise<void> =>
    requests.put("ResultValidation", update),
  getresultPdf: (listResults: any): Promise<void> =>
    requests.print(`ResultValidation/view/list`, listResults),
  getOrderPdf: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`ResultValidation/order/${recordId}/${requestId}`),
  exportList: (search: IGeneralForm): Promise<void> =>
    requests.download(`ResultValidation/export/list`, search), //, "Catálogo de Sucursales.xlsx"
};

export default ResultValidation;
