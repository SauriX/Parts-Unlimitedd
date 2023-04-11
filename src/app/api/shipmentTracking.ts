import { ISamplingForm, ISamplingList, IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import requests from "./agent";
import {shipmenttracking} from "../models/shipmentTracking"
import {IRouteTrackingForm} from "../models/trackingOrder"
import { reciveTracking } from "../models/ReciveTracking";
const ShipmentTracking = {
  access: (): Promise<IScopes> => requests.get("scopes/ShipmentTracking"),
  getAll: (search: string): Promise<shipmenttracking> =>
    requests.get(`ShipmentTracking/order/${search}`),
    exportList: (trackingOrder: IRouteTrackingForm): Promise<void> =>
    requests.download(`tracking-order/export/form`, trackingOrder),
    getById: (id: string): Promise<IRouteTrackingForm> =>
    requests.get(`ShipmentTracking/${id}`),
    getReciveById: (id: string): Promise<reciveTracking> =>
    requests.get(`ShipmentTracking/recive/${id}`),
    updaterecive:(data:reciveTracking):Promise<boolean>=>
    requests.put(`ShipmentTracking/recive`,data),

};

export default ShipmentTracking;
