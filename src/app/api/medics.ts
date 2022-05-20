import { IMedicsForm, IMedicsList } from "../models/medics";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Medics = {
  access: (): Promise<IScopes> => requests.get("scopes/medic"),
  getAll: (search: string): Promise<IMedicsList[]> => requests.get(`medic/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IMedicsForm> => requests.get(`medic/${id}`),
  create: (medics: IMedicsForm): Promise<void> => requests.post("medic", medics),
  update: (medics: IMedicsForm): Promise<void> => requests.put("medic", medics),
  exportList: (search: string): Promise<void> =>
    requests.download(`medic/export/list/${!search ? "all" : search}`), //, "Catálogo de Medicos.xlsx"
  exportForm: (id: string, clave: string): Promise<void> => requests.download(`medic/export/form/${id}`), //, `Catálogo de Medicos (${clave}).xlsx`
};

export default Medics;
