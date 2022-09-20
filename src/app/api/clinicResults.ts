import { IClinicResultForm, IClinicResultList } from "../models/clinicResults";
import { IScopes } from "../models/shared";
import requests from "./agent";

const ClinicResults = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: IClinicResultForm): Promise<IClinicResultList[]> =>
    requests.post(`clinicResults/getList`, search),
  exportList: (search: IClinicResultForm): Promise<void> =>
    requests.download(`clinicResults/export/list`, search),
};

export default ClinicResults;
