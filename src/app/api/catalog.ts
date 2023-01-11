import { IAreaDeparment, ICatalogForm, ICatalogList } from "../models/catalog";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Catalog = {
  access: (): Promise<IScopes> => requests.get("scopes/catalog"),
  getAll: (catalogName: string, search?: string): Promise<ICatalogList[]> =>
    requests.get(`catalog/${catalogName}/all/${!search ? "all" : search}`),
  getActive: <Type extends ICatalogList>(
    catalogName: string
  ): Promise<Type[]> => requests.get(`catalog/${catalogName}/active`),
  getById: <Type extends ICatalogList>(
    catalogName: string,
    id: number
  ): Promise<Type> => requests.get(`catalog/${catalogName}/${id}`),
  create: (catalogName: string, catalog: ICatalogForm): Promise<ICatalogList> =>
    requests.post(`catalog/${catalogName}`, catalog),
  update: (catalogName: string, catalog: ICatalogForm): Promise<ICatalogList> =>
    requests.put(`catalog/${catalogName}`, catalog),
  exportList: (catalogName: string, search: string): Promise<void> =>
    requests.download(
      `catalog/${catalogName}/export/list/${!search ? "all" : search}`
    ),
  exportForm: (catalogName: string, id: number): Promise<void> =>
    requests.download(`catalog/${catalogName}/export/form/${id}`),
  getAreaByDeparment: (): Promise<IAreaDeparment[]> =>
    requests.get(`catalog/area/getAreaByDeparment`),
};

export default Catalog;
