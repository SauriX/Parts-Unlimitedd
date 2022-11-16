import {
  IDeliverResultsForm,
  IMassSearch,
  IParameter,
  IResult,
  IResultList,
} from "./../models/massResultSearch";
import requests from "./agent";
const MassResultSearch = {
  getParameters: (search: IMassSearch): Promise<IParameter> =>
    requests.post("MassSearch/parameters", search),
  getResults: (search: IMassSearch): Promise<IResult> =>
    requests.post("MassSearch/results", search),
  getRequestResults: (search: IMassSearch): Promise<IResultList> =>
    requests.post("MassSearch/GetByFilter", search),
  getAllCaptureResults: (search: IDeliverResultsForm): Promise<any[]> =>
    requests.post("MassSearch/GetAllCaptureResults", search),
  exportListDeliverResult: (search: any): Promise<void> =>
    requests.download("MassSearch/list", search),
};

export default MassResultSearch;
