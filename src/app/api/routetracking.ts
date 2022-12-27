import { IBranchCity, IBranchForm, IBranchInfo } from "../models/branch";
import { ISearchPending,IRecibe } from "../models/pendingRecive";
import { IRouteList, SearchTracking } from "../models/routeTracking";
import { IUpdate } from "../models/sampling";
import requests from "./agent";

const RouteTracking = {
  access: (): Promise<void> => requests.get("/user/scopes"),
    getAll: (search: SearchTracking): Promise<IRouteList[]> => requests.post(`RouteTracking/all`,search),
    update: (update: IUpdate[]): Promise<void> => requests.put("RouteTracking", update),
    exportForm: (id: string): Promise<void> =>
    requests.print(`RouteTracking/exportOrder/${id}`,),
    getRecive: (search: ISearchPending): Promise<IRecibe[]> => requests.post(`RouteTracking/allrecive`,search),
    exportFormpending: (id: ISearchPending): Promise<void> =>
    requests.download(`RouteTracking/report`,id),

/*   getById: (id: string): Promise<IBranchForm> => requests.get(`Branch/${id}`),
  getBranchByCity: (): Promise<IBranchCity[]> => requests.get(`Branch/getSucursalByCity`),
  //getPermission: (): Promise<IRolePermission[]> => requests.get(`Rol/permisos`), 
  create: (branch: IBranchForm): Promise<boolean> => requests.post("/Branch", branch),
  update: (branch: IBranchForm): Promise<boolean> => requests.put("/Branch", branch),
  exportList: (search: string): Promise<void> =>
    requests.download(`Branch/export/list/${!search ? "all" : search}`),
  exportForm: (id: string, clave?: string): Promise<void> => requests.download(`Branch/export/form/${id}`), */
};

export default RouteTracking;
