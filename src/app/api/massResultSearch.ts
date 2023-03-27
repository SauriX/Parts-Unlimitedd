import { IGeneralForm } from "../models/general";
import {
  IDeliverResultsForm,
  IMassSearch,
  IParameter,
  IResult,
  IResultList,
} from "./../models/massResultSearch";
import requests from "./agent";
const MassResultSearch = {
  getParameters: (search: IGeneralForm): Promise<IParameter> =>
    requests.post("MassSearch/parameters", search),
  getResults: (search: IGeneralForm): Promise<IResult> =>
    requests.post("MassSearch/results", search),
  getRequestResults: (search: IGeneralForm): Promise<IResultList> =>
    requests.post("MassSearch/GetByFilter", search),
  getAllCaptureResults: (search: IGeneralForm): Promise<any[]> =>
    requests.post("MassSearch/GetAllCaptureResults", search),
  exportListDeliverResult: (search: any): Promise<void> =>
    requests.download("MassSearch/list", search),
  printPdf: (search: IGeneralForm): Promise<void> =>
    requests.download(`MassSearch/download/pdf`, search),
    getOrderPdf: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`MassSearch/order/${recordId}/${requestId}`),
};

export default MassResultSearch;