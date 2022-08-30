import { IRouteForm, IRouteList } from "../models/route";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Route = {
  access: (): Promise<IScopes> => requests.get("scopes/medic"),
  getAll: (search: string): Promise<IRouteList[]> =>
    requests.get(`route/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IRouteForm> => requests.get(`route/${id}`),
  create: (route: IRouteForm): Promise<IRouteList> =>
    requests.post("/route", route),
  update: (route: IRouteForm): Promise<IRouteList> =>
    requests.put("/route", route),
  find: (route: IRouteForm): Promise<IRouteForm[]> =>
    requests.post("/route/find", route),
  exportList: (search: string): Promise<void> =>
    requests.download(`route/export/list/${!search ? "all" : search}`),
  exportForm: (id: string): Promise<void> =>
    requests.download(`route/export/form/${id}`),
};

export default Route;
