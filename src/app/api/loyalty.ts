import { ILoyaltyForm, ILoyaltyList } from "../models/loyalty";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Loyaltys = {
  access: (): Promise<IScopes> => requests.get("scopes/loyalty"),
  getAll: (search: string): Promise<ILoyaltyList[]> =>
    requests.get(`loyalty/all/${!search ? "all" : search}`),
  getActive: <Type extends ILoyaltyList>(): Promise<Type[]> =>
    requests.get(`loyalty/active`),
  getById: (id: string): Promise<ILoyaltyForm> => requests.get(`loyalty/${id}`),
  getByDate: (date: Date): Promise<ILoyaltyForm> =>
    requests.post(`loyalty/findByDate`, date),
  create: (loyaltys: ILoyaltyForm): Promise<void> =>
    requests.post("loyalty", loyaltys),
  update: (loyaltys: ILoyaltyForm): Promise<void> =>
    requests.put("loyalty", loyaltys),
  exportList: (search: string): Promise<void> =>
    requests.download(`loyalty/export/list/${!search ? "all" : search}`),
  exportForm: (id: string, clave: string): Promise<void> =>
    requests.download(`loyalty/export/form/${id}`), //, `Catálogo de Medicos (${clave}).xlsx`
  crearReagendado: (loyaltys: ILoyaltyForm): Promise<void> =>
    requests.post("loyalty", loyaltys),
};

export default Loyaltys;
