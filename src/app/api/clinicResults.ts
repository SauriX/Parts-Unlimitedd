import {
  IClinicResultForm,
  IClinicResultList,
  IResultPathological,
} from "../models/clinicResults";
import { IRequestStudyInfo } from "../models/request";
import { IScopes } from "../models/shared";
import requests from "./agent";

const ClinicResults = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: IClinicResultForm): Promise<IClinicResultList[]> =>
    requests.post(`clinicResults/getList`, search),
  createResultPathological: (search: FormData): Promise<void> =>
    // createResultPathological: (search: IResultPathological): Promise<void> =>
    requests.post(`clinicResults/savePathological`, search),
  // updateResultPathological: (search: IResultPathological): Promise<void> =>
  updateResultPathological: (search: FormData): Promise<void> =>
    requests.put(`clinicResults/updatePathological`, search),
  updateStatusStudy: (requestStudyId: number, status: number): Promise<void> =>
    requests.put(`clinicResults/updateStatusStudy`, { requestStudyId, status }),
  getResultPathological: (search: number): Promise<IResultPathological> =>
    requests.post(`clinicResults/getPathological`, search),
  getRequestStudyById: (requestStudy: number): Promise<any> =>
    requests.post(`clinicResults/getRequestStudyById`, requestStudy),
  exportList: (search: IClinicResultForm): Promise<void> =>
    requests.download(`clinicResults/export/list`, search),
  printSelectedStudies: (configuration: any): Promise<void> =>
    requests.print(`clinicResults/printSelectedStudies`, configuration),
};

export default ClinicResults;
