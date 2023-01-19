import { ICompanyForm, ICompanyList } from "../models/company";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Company = {
  access: (): Promise<IScopes> => requests.get("scopes/company"),
  getActive: (): Promise<ICompanyList[]> => requests.get(`company/active`),
  getAll: (search: string): Promise<ICompanyList[]> =>
    requests.get(`company/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<ICompanyForm> => requests.get(`company/${id}`),
  getContactsByCompany: (id: string): Promise<any> =>
    requests.get(`company/contacts/${id}`),
  create: (company: ICompanyForm): Promise<void> =>
    requests.post("company", company),
  update: (company: ICompanyForm): Promise<void> =>
    requests.put("company", company),
  gepass: (): Promise<string> => requests.get(`company/paswwordgenerator`),
  exportList: (search: string): Promise<void> =>
    requests.download(`company/export/list/${!search ? "all" : search}`), //, "Catálogo de Medicos.xlsx"
  exportForm: (id: string, clave: string): Promise<void> =>
    requests.download(`company/export/form/${id}`), //, `Catálogo de Compañias (${clave}).xlsx`
};

export default Company;
