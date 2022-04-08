import { IMedicsForm, IMedicsList } from "../models/medics";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Medics = {
  access: (): Promise<IScopes> => requests.get("scopes/medics"),
  getAll: (search: string): Promise<IMedicsList[]> => 
 requests.get(`medics/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IMedicsForm> => requests.get(`medics/${id}`),
  create: (medics: IMedicsForm): Promise<void> => requests.post("medics", medics),
  update: (medics: IMedicsForm): Promise<void> => requests.put("medics", medics),
  exportList: (search: string): Promise<void> =>
    requests.download(`medics/export/list/${!search ? "all" : search}`, "Catálogo de Medicos.xlsx"),
  exportForm: (id: number, clave: string): Promise<void> =>
    requests.download(`medics/export/form/${id}`, `Catálogo de Medicos (${clave}).xlsx`),
};

export default Medics;
