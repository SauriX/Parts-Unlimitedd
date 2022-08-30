import {
  ITrackingOrderForm,
  ITrackingOrderList,
} from "../models/trackingOrder";
import { IScopes } from "../models/shared";
import requests from "./agent";

const TrackingOrder = {
  access: (): Promise<IScopes> => requests.get("scopes/tracking-order"),
  getAll: (search: string): Promise<ITrackingOrderList[]> =>
    requests.get(`tracking-order/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<ITrackingOrderForm> =>
    requests.get(`tracking-order/${id}`),
  create: (trackingOrder: ITrackingOrderForm): Promise<void> =>
    requests.post("tracking-order", trackingOrder),
  update: (trackingOrder: ITrackingOrderForm): Promise<void> =>
    requests.put("tracking-order", trackingOrder),
  exportList: (search: string): Promise<void> =>
    requests.download(`tracking-order/export/list/${!search ? "all" : search}`),
  exportForm: (id: number): Promise<void> =>
    requests.download(`tracking-order/export/form/${id}`),
};

export default TrackingOrder;
