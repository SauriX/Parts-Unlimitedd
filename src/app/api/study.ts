import { IStudyTec, IStudyForm, IStudyList } from "../models/study";
import { IScopes } from "../models/shared";
import requests from "./agent";
import { IPriceListEstudioList } from "../models/priceList";

const Study = {
  access: (): Promise<IScopes> => requests.get("scopes/study"),
  getAll: (search: string): Promise<IStudyList[]> => requests.get(`study/all/${!search ? "all" : search}`),
  getAllPrice: (search: string): Promise<IPriceListEstudioList[]> => requests.get(`study/studyList/${!search ? "all" : search}`),
  getActive: (): Promise<IStudyList[]> => requests.get(`study/active`),
  getById: (id: number): Promise<IStudyForm> => requests.get(`study/${id}`),
  getStudyInfoById: (id: number): Promise<IStudyTec> => requests.get(`study/tecinfo/${id}`),
  create: (study: IStudyForm): Promise<boolean> => requests.post("/study", study),
  update: (study: IStudyForm): Promise<boolean> => requests.put("/study", study),
  exportList: (search: string): Promise<void> =>
    requests.download(`study/export/list/${!search ? "all" : search}`),
  exportForm: (id: number, clave?: string): Promise<void> => requests.download(`study/export/form/${id}`),
};

export default Study;
