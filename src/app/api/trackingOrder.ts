import {
  IRouteTrackingForm,
  IStudyTrackinOrder,
  ITagRouteList,
  IRequestStudyOrder,
  searchstudies,
} from "../models/trackingOrder";
import { IScopes } from "../models/shared";
import requests from "./agent";

const TrackingOrder = {
  access: (): Promise<IScopes> => requests.get("scopes/tracking-order"),
  getAll: (search: string): Promise<ITagRouteList[]> =>
    requests.get(`tracking-order/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IRouteTrackingForm> =>
    requests.get(`tracking-order/${id}`),
  create: (trackingOrder: IRouteTrackingForm): Promise<any> =>
    requests.post("tracking-order", trackingOrder),
  update: (trackingOrder: IRouteTrackingForm): Promise<void> =>
    requests.put("tracking-order/general", trackingOrder),
  exportList: (trackingOrder: IRouteTrackingForm): Promise<void> =>
    requests.download(`tracking-order/export/form`, trackingOrder),
  exportForm: (id: number): Promise<void> =>
    requests.download(`tracking-order/export/form/${id}`),
  findStudies: (study: number[]): Promise<ITagRouteList[]> =>
    requests.post(`tracking-order/findStudies`, study),
    findStudiesAll: (study: searchstudies): Promise<ITagRouteList[]> =>
    requests.post(`tracking-order/findStudiesall`, study),
    findRequestStudies: (solicitud:string): Promise<IRequestStudyOrder[]> =>
    requests.get(`tracking-order/findStudies/${solicitud}`),
  confirmarRecoleccion: (seguimientoId: string): Promise<void> =>
    requests.post(`tracking-order/confirmarRecoleccion`, seguimientoId),
  cancelarRecoleccion: (seguimientoId: string): Promise<void> =>
    requests.post(`tracking-order/cancelarRecoleccion`, seguimientoId),
};

export default TrackingOrder;
