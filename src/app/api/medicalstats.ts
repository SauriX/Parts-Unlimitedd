import { IMedicalStatsForm, IMedicalStatsList } from "../models/medical_stats";
import { IScopes } from "../models/shared";
import requests from "./agent";

const MedicalStats = {
  getAll: (reportName: string, search?: string): Promise<IMedicalStatsList[]> =>
    requests.get(`report/${reportName}/all${!search ? "all" : search}`),
  getByDoctor: (): Promise<IMedicalStatsList[]> =>
    requests.get(`report/medicos/getByDoctor`),
  access: (): Promise<IScopes> => requests.get("scopes/medicalstats"),
  filtro: (search: IMedicalStatsForm): Promise<IMedicalStatsList[]> =>
    requests.post(`report/medicos/filter`, search ?? {}),
  printPdf: (search?: IMedicalStatsForm): Promise<void> =>
    requests.download(`report/medicos/download/pdf`, search ?? {}),
  exportList: (reportName: string, search: string): Promise<void> =>
    requests.download(
      `report/medicos/${reportName}/export/list/${!search ? "all" : search}`
    ),
  exportForm: (id: string): Promise<void> =>
    requests.download(`report/medicos/export/form/${id}`),
};

export default MedicalStats;
