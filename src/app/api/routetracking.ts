import { ISearchPending, IRecibe } from "../models/pendingRecive";
import {
  IRouteTrackingList,
  ITagTrackingOrder,
  ISearchTracking,
} from "../models/routeTracking";
import { IUpdate } from "../models/sampling";
import { IRouteTrackingForm } from "../models/trackingOrder";
import requests from "./agent";

const RouteTracking = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAllPendingSend: (search: ISearchTracking): Promise<IRouteTrackingList[]> =>
    requests.post(`RouteTracking/allSend`, search),
  getById: (id: string): Promise<IRouteTrackingForm> =>
    requests.get(`RouteTracking/${id}`),
  getAllTags: (search: string): Promise<ITagTrackingOrder[]> =>
    requests.get(`RouteTracking/tags/all/${!search ? "all" : search}`),
  getFindTags: (routeId: string): Promise<ITagTrackingOrder[]> =>
    requests.get(`RouteTracking/findTags/${routeId}`),
  getActive: (): Promise<IRouteTrackingList[]> =>
    requests.get(`RouteTracking/getActive`),

  createTrackingOrder: (order: IRouteTrackingForm): Promise<void> =>
    requests.post("RouteTracking/trackingOrder", order),
  updateTrackingOrder: (order: IRouteTrackingForm): Promise<void> =>
    requests.put("RouteTracking/trackingOrder", order),
  exportTrackingOrderForm: (id: string): Promise<void> =>
    requests.print(`RouteTracking/exportOrder/${id}`),

  getAllPendingReceive: (
    search: ISearchTracking
  ): Promise<IRouteTrackingList[]> =>
    requests.post(`RouteTracking/allReceive`, search),
  exportReceiveForm: (id: ISearchTracking): Promise<void> =>
    requests.download(`RouteTracking/report`, id),
};

export default RouteTracking;
