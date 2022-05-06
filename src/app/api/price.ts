import { IPriceListForm, IPriceListList } from "../models/price";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Price = {
  access: (): Promise<IScopes> => requests.get("scopes/price"),
  getAll: (search: string): Promise<IPriceListList[]> =>
    requests.get(`price/all/${!search ? "all" : search}`),
  getActive: <Type extends IPriceListList>(catalogName: string): Promise<Type[]> =>
    requests.get(`price/${catalogName}/active`),
  getById: (id: number): Promise<IPriceListForm> => requests.get(`medics/${id}`),
  create: (price: IPriceListForm): Promise<void> => requests.post("medics", price),
  update: (price: IPriceListForm): Promise<void> => requests.put("medics", price),
  exportList: (search: string): Promise<void> =>
    requests.download(`price/export/list/${!search ? "all" : search}`), //, "Catálogo de Precios.xlsx"
  exportForm: (id: number, clave: string): Promise<void> => requests.download(`price/export/form/${id}`), //, `Catálogo de Precios (${clave}).xlsx`
};

export default Price;
