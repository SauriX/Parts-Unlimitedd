import { IStudyForm, IStudyList } from "../models/study";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Study = {
  access: (): Promise<IScopes> => requests.get("scopes/medics"),
  getAll: (search: string): Promise<IStudyList[]> => 
 requests.get(`study/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IStudyForm> => requests.get(`study/${id}`),

};

export default Study;