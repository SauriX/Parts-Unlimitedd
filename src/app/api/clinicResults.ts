import {
  IClinicResultCaptureForm,
  IClinicResultForm,
  IClinicResultList,
  IClinicStudy,
  IResultPathological,
} from "../models/clinicResults";
import {
  IRequestStudy,
  IRequestStudyInfo,
  IRequestStudyUpdate,
} from "../models/request";
import { IScopes } from "../models/shared";
import requests from "./agent";

const ClinicResults = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
  getAll: (search: IClinicResultForm): Promise<IClinicResultList[]> =>
    requests.post(`clinicResults/getList`, search),
  getStudies: (
    recordId: string,
    requestId: string
  ): Promise<IRequestStudyUpdate> =>
    requests.get(`clinicResults/studies_params/${recordId}/${requestId}`),
  getLabResultsById: (id: string): Promise<IClinicResultCaptureForm[]> =>
    requests.get(`parameter/${id}`),
  createResults: (results: IClinicResultCaptureForm[]): Promise<string[]> =>
    requests.post(`clinicResults/saveResults`, results),
  updateResults: (
    results: IClinicResultCaptureForm[],
    envioManual: boolean
  ): Promise<void> =>
    requests.put(`clinicResults/updateResults/${envioManual}`, results),
  createResultPathological: (search: FormData): Promise<void> =>
    requests.post(`clinicResults/savePathological`, search),
  // updateResultPathological: (search: IResultPathological): Promise<void> =>
  updateResultPathological: (
    search: FormData,
    envioManual: boolean
  ): Promise<void> =>
    requests.put(`clinicResults/updatePathological/${envioManual}`, search),
  sendResultFile: (listResults: any): Promise<void> =>
    requests.put(`clinicResults/sendResultFile`, listResults),
  updateStatusStudy: (requestStudyId: number, status: number): Promise<void> =>
    requests.put(`clinicResults/updateStatusStudy`, { requestStudyId, status }),
  getResultPathological: (search: number): Promise<IResultPathological> =>
    requests.post(`clinicResults/getPathological`, search),
  getLaboratoryResults: (search: number): Promise<IClinicResultCaptureForm[]> =>
    requests.post(`clinicResults/getLaboratoryResults`, search),
  getRequestStudyById: (requestStudy: number): Promise<any> =>
    requests.post(`clinicResults/getRequestStudyById`, requestStudy),
  exportList: (search: IClinicResultForm): Promise<void> =>
    requests.download(`clinicResults/export/list`, search),
  exportGlucose: (search: IClinicResultCaptureForm): Promise<void> =>
    requests.download(`clinicResults/export/glucose`, search),
  printResults: (recordId: string, requestId: string): Promise<void> =>
    requests.print(`clinicResults/labResults/${recordId}/${requestId}`),
  printSelectedStudies: (configuration: any): Promise<void> =>
    requests.print(`clinicResults/printSelectedStudies`, configuration),
};

export default ClinicResults;
