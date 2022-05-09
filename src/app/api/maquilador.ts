import { IMaquiladorForm, IMaquiladorList } from "../models/maquilador";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Maquilador = {
  access: (): Promise<IScopes> => requests.get("scopes/maquila"),
  getAll: (search: string): Promise<IMaquiladorList[]> =>
    requests.get(`maquila/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IMaquiladorForm> => requests.get(`maquila/${id}`),
  create: (maquilador: IMaquiladorForm): Promise<void> => requests.post("maquila", maquilador),
  update: (maquilador: IMaquiladorForm): Promise<void> => requests.put("maquila", maquilador),
  exportList: (search: string): Promise<void> =>
    requests.download(`maquila/export/list/${!search ? "all" : search}`),
  exportForm: (id: number, clave: string): Promise<void> => requests.download(`maquila/export/form/${id}`),
};

export default Maquilador;
