import { IMaquiladorForm, IMaquiladorList } from "../models/maquilador";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Maquilador = {
  access: (): Promise<IScopes> => requests.get("scopes/maquilador"),
  getAll: (search: string): Promise<IMaquiladorList[]> => 
 requests.get(`maquilador/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IMaquiladorForm> => requests.get(`maquilador/${id}`),
  create: (maquilador: IMaquiladorForm): Promise<void> => requests.post("maquilador", maquilador),
  update: (maquilador: IMaquiladorForm): Promise<void> => requests.put("maquilador", maquilador),
  exportList: (search: string): Promise<void> =>
    requests.download(`maquilador/export/list/${!search ? "all" : search}`, "Catálogo de Maquilador.xlsx"),
  exportForm: (id: number, clave: string): Promise<void> =>
    requests.download(`maquilador/export/form/${id}`, `Catálogo de Maquilador (${clave}).xlsx`),
};

export default Maquilador;