import { IReagentForm, IReagentList } from "../models/reagent";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Reagent = {
  access: (): Promise<IScopes> => requests.get("scopes/reagent"),
  getAll: (search: string): Promise<IReagentList[]> =>
    requests.get(`reagent/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IReagentForm> => requests.get(`reagent/${id}`),
  create: (reagent: IReagentForm): Promise<void> => requests.post("reagent", reagent),
  update: (reagent: IReagentForm): Promise<void> => requests.put("reagent", reagent),
  exportList: (search: string): Promise<void> =>
    requests.download(`reagent/export/list/${!search ? "all" : search}`),
  exportForm: (id: number): Promise<void> => requests.download(`reagent/export/form/${id}`),
};

export default Reagent;
