import { IIndicationForm, IIndicationList } from "../models/indication";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Indication = {
  access: (): Promise<IScopes> => requests.get("scopes/indication"),
  getAll: (search: string): Promise<IIndicationList[]> =>
    requests.get(`indication/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IIndicationForm> => requests.get(`indication/${id}`),
  create: (indication: IIndicationForm): Promise<void> => requests.post("indication", indication),
  update: (indication: IIndicationForm): Promise<void> => requests.put("indication", indication),
  exportList: (search: string): Promise<void> =>
    requests.download(`indication/export/list/${!search ? "all" : search}`), //, "Catálogo de Indicaciones.xlsx"
  exportForm: (id: number, clave: string): Promise<void> => requests.download(`indication/export/form/${id}`), //, `Catálogo de Indicaciones (${clave}).xlsx`
};

export default Indication;
