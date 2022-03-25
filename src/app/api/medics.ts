import { IMedicsForm, IMedicsList } from "../models/medics";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Medics = {
  access: (): Promise<IScopes> => requests.get("scopes/medics"),
  getAll: (): Promise<IMedicsList[]> => requests.get("medics/all/all"),
  getById: (id: number): Promise<IMedicsForm> => requests.get(`medics/${id}`),
  create: (medics: IMedicsForm): Promise<void> => requests.post("medics", medics),
  update: (medics: IMedicsForm): Promise<void> => requests.put("medics", medics),
};

export default Medics;
