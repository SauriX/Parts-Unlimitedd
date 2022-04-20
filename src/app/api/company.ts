import { ICompanyForm, ICompanyList } from "../models/company";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Company = {
  access: (): Promise<IScopes> => requests.get("scopes/company"),
  getAll: (search: string): Promise<ICompanyList[]> => 
 requests.get(`company/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<ICompanyForm> => requests.get(`company/${id}`),
  create: (company: ICompanyForm): Promise<void> => requests.post("company", company),
  update: (company: ICompanyForm): Promise<void> => requests.put("company", company),
  exportList: (search: string): Promise<void> =>
    requests.download(`company/export/list/${!search ? "all" : search}`, "Catálogo de Medicos.xlsx"),
  exportForm: (id: number, clave: string): Promise<void> =>
    requests.download(`company/export/form/${id}`, `Catálogo de Compañias (${clave}).xlsx`),
};

export default Company;