import { IBranchInfo } from "../models/branch";
import { ICompanyList } from "../models/company";
import { IMedicsList } from "../models/medics";
import { IPriceListForm, IPriceListList, ISucMedComList } from "../models/priceList";
import { IScopes } from "../models/shared";
import requests from "./agent";

const PriceList = {
  access: (): Promise<IScopes> => requests.get("scopes/price"),
  getAll: (search: string): Promise<IPriceListList[]> => 
  requests.get(`price/all/${!search ? "all" : search}`),

  getAllBranch: (): Promise<ISucMedComList[]> => 
  requests.get(`price/branch/`),
  getAllMedics: (): Promise<ISucMedComList[]> => 
  requests.get(`price/medics/`),
  getAllCompany: (): Promise<ISucMedComList[]> => 
  requests.get(`price/company/`),

  getActive: <Type extends IPriceListList>(): Promise<Type[]> =>
    requests.get(`price/active`),
  getById: (id: string): Promise<IPriceListForm> => requests.get(`price/${id}`),
  create: (priceList: IPriceListForm): Promise<IPriceListList> => requests.post("price", priceList),
  update: (priceList: IPriceListForm): Promise<IPriceListList> => requests.put("price", priceList),
  exportList: (search: string): Promise<void> =>
    requests.download(`price/export/list/${!search ? "all" : search}`),
  exportForm: (id: string): Promise<void> =>
    requests.download(`price/export/form/${id}`),
};

export default PriceList;