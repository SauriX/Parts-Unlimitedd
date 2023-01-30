import {
  IPriceListForm,
  IPriceListInfoFilter,
  IPriceListInfoPack,
  IPriceListInfoStudy,
  IPriceListList,
  ISucMedComList,
} from "../models/priceList";
import { IPromotionEstudioList } from "../models/promotion";
import { IScopes } from "../models/shared";
import requests from "./agent";

const PriceList = {
  access: (): Promise<IScopes> => requests.get("scopes/price"),
  getAll: (search: string): Promise<IPriceListList[]> =>
    requests.get(`price/all/${!search ? "all" : search}`),

  getAllBranch: (): Promise<ISucMedComList[]> => requests.get(`price/branch/`),
  getAllMedics: (): Promise<ISucMedComList[]> => requests.get(`price/medics/`),
  getAllCompany: (): Promise<ISucMedComList[]> =>
    requests.get(`price/company/`),

  getActive: <Type extends IPriceListList>(): Promise<Type[]> =>
    requests.get(`price/active`),
  getById: (id: string): Promise<IPriceListForm> => requests.get(`price/${id}`),
  getStudiesById: (filter: any): Promise<IPromotionEstudioList[]> =>
    requests.post(`price/studies`, filter),
  getPriceStudy: (
    filter?: IPriceListInfoFilter
  ): Promise<IPriceListInfoStudy> =>
    requests.post(`price/info/study`, filter ?? {}),
  getPricePack: (filter?: IPriceListInfoFilter): Promise<IPriceListInfoPack> =>
    requests.post(`price/info/pack`, filter ?? {}),
  create: (priceList: IPriceListForm): Promise<IPriceListList> =>
    requests.post("price", priceList),
  update: (priceList: IPriceListForm): Promise<IPriceListList> =>
    requests.put("price", priceList),
  exportList: (search: string): Promise<void> =>
    requests.download(`price/export/list/${!search ? "all" : search}`),
  exportForm: (id: string): Promise<void> =>
    requests.download(`price/export/form/${id}`),
};

export default PriceList;
