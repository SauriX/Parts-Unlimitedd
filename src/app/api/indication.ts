import { IIndicationForm, IIndicationList } from "../models/indication";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Indication = {
  access: (): Promise<IScopes> => requests.get("scopes/indication"),
  getAll: (search: string): Promise<IIndicationList[]> => 
  requests.get(`indications/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IIndicationForm> => requests.get(`indication/${id}`),
  create: (indication: IIndicationForm): Promise<void> => requests.post("indication", indication),
  update: (indication: IIndicationForm): Promise<void> => requests.put("indication", indication),
};

export default Indication;
