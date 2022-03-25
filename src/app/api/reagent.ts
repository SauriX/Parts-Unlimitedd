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
};

export default Reagent;
