import {
  ITrackingOrderForm,
  ITrackingOrderList,
  IEstudiosList,
} from "../models/trackingOrder";
import { IScopes } from "../models/shared";
import requests from "./agent";

const TrackingOrder = {
  access: (): Promise<IScopes> => requests.get("scopes/tracking-order"),
  getAll: (search: string): Promise<IEstudiosList[]> =>
    requests.get(`tracking-order/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<ITrackingOrderForm> =>
    requests.get(`tracking-order/${id}`),
  create: (trackingOrder: ITrackingOrderForm): Promise<any> =>
    requests.post("tracking-order", trackingOrder),
  update: (trackingOrder: ITrackingOrderForm): Promise<void> =>
    requests.put("tracking-order/general", trackingOrder),
  exportList: (trackingOrder: ITrackingOrderForm): Promise<void> =>
    requests.download(`tracking-order/export/form`, trackingOrder),
  exportForm: (id: number): Promise<void> =>
    requests.download(`tracking-order/export/form/${id}`),
  findStudies: (study: number[]): Promise<IEstudiosList[]> =>
    requests.post(`tracking-order/findStudies`, study),
  confirmarRecoleccion: (seguimientoId: string): Promise<void> =>
    requests.post(`tracking-order/confirmarRecoleccion`, seguimientoId),
  cancelarRecoleccion: (seguimientoId: string): Promise<void> =>
    requests.post(`tracking-order/cancelarRecoleccion`, seguimientoId),
};

export default TrackingOrder;
