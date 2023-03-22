import {
  IPromotionStudyPack,
  IPromotionForm,
  IPromotionList,
} from "../models/promotion";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Promotion = {
  access: (): Promise<IScopes> => requests.get("scopes/reagent"),
  getAll: (search: string): Promise<IPromotionList[]> =>
    requests.get(`promotion/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IPromotionForm> =>
    requests.get(`promotion/${id}`),
  getStudies: (
    promo: IPromotionForm,
    initial: boolean
  ): Promise<IPromotionStudyPack[]> =>
    requests.post(`promotion/studies/${initial}`, promo),
  getActive: (): Promise<IPromotionList[]> => requests.get(`promotion/active`),
  create: (promotion: IPromotionForm): Promise<IPromotionList> =>
    requests.post("promotion", promotion),
  update: (promotion: IPromotionForm): Promise<IPromotionList> =>
    requests.put("promotion", promotion),
  exportList: (search: string): Promise<void> =>
    requests.download(`promotion/export/list/${!search ? "all" : search}`),
  exportForm: (id: number): Promise<void> =>
    requests.download(`promotion/export/form/${id}`),
};

export default Promotion;
