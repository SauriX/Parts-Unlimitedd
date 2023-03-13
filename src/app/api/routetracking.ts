import { IBranchCity, IBranchForm, IBranchInfo } from "../models/branch";
import { ISearchPending, IRecibe } from "../models/pendingRecive";
import {
  IRouteTrackingList,
  ITagTrackingOrder,
  SearchTracking,
} from "../models/routeTracking";
import { IUpdate } from "../models/sampling";
import requests from "./agent";

const RouteTracking = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (search: SearchTracking): Promise<IRouteTrackingList[]> =>
    requests.post(`RouteTracking/all`, search),
  getAllTags: (search: string): Promise<ITagTrackingOrder[]> =>
    requests.post(`RouteTracking/tags/all`, search),
  getFindTags: (routeId: string): Promise<ITagTrackingOrder[]> =>
    requests.get(`RouteTracking/findTags/${routeId}`),
  update: (update: IUpdate[]): Promise<void> =>
    requests.put("RouteTracking", update),
  exportForm: (id: string): Promise<void> =>
    requests.print(`RouteTracking/exportOrder/${id}`),
  getRecive: (search: ISearchPending): Promise<IRecibe[]> =>
    requests.post(`RouteTracking/allrecive`, search),
  exportFormpending: (id: ISearchPending): Promise<void> =>
    requests.download(`RouteTracking/report`, id),
};

export default RouteTracking;
