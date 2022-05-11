import { IBranchInfo } from "../models/branch";
import { ICompanyList } from "../models/company";
import { IMedicsList } from "../models/medics";
import { IPriceListForm, IPriceListList } from "../models/priceList";
import { IScopes } from "../models/shared";
import requests from "./agent";

const PriceList = {
  access: (): Promise<IScopes> => requests.get("scopes/price"),
  getAll: (search: string): Promise<IPriceListList[]> => 
  requests.get(`price/all/${!search ? "all" : search}`),

  getAllBrench: (search: string): Promise<IBranchInfo[]> => 
  requests.get(`price/all/${!search ? "all" : search}`),
  getAllMedics: (search: string): Promise<IMedicsList[]> => 
  requests.get(`price/all/${!search ? "all" : search}`),
  getAllCompany: (search: string): Promise<ICompanyList[]> => 
  requests.get(`price/all/${!search ? "all" : search}`),

  getActive: <Type extends IPriceListList>(catalogName: string): Promise<Type[]> =>
    requests.get(`price/${catalogName}/active`),
  getById: (id: string): Promise<IPriceListForm> => requests.get(`price/${id}`),
  create: (priceList: IPriceListForm): Promise<IPriceListList> => requests.post("price", priceList),
  update: (priceList: IPriceListForm): Promise<IPriceListList> => requests.put("price", priceList),
  exportList: (search: string): Promise<void> =>
    requests.download(`price/export/list/${!search ? "all" : search}`),
  exportForm: (id: string): Promise<void> =>
    requests.download(`price/export/form/${id}`),
};

export default PriceList;