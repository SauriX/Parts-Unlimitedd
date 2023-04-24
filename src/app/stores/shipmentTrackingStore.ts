import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import shipmentTracking from "../api/shipmentTracking";
import { IShipmentTracking } from "../models/shipmentTracking";
import moment from "moment";
import { reciveTracking } from "../models/ReciveTracking";

export default class shipmentTackingStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  shipment?: IShipmentTracking;
  recive?: reciveTracking;
  loadingOrders: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };

  access = async () => {
    try {
      const scopes = await shipmentTracking.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      //history.push("/forbidden");
    }
  };

  getShipmentById = async (id: string) => {
    try {
      this.loadingOrders = true;
      const shipmentOrder = await shipmentTracking.getShipmentById(id);
      this.shipment = shipmentOrder;
      return shipmentOrder;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingOrders = false;
    }
  };

  getaRecive = async (id: string) => {
    try {
      const scopes = await shipmentTracking.getReciveById(id);

      scopes.fechaEnvio = moment(scopes.fechaEnvio);
      scopes.horaEnvio = moment(scopes.horaEnvio);
      scopes.fechaEnestimada = moment(scopes.fechaEnestimada);
      scopes.horaEnestimada = moment(scopes.horaEnestimada);
      scopes.fechaEnreal = moment(scopes.fechaEnreal);
      scopes.horaEnreal = moment(scopes.horaEnreal);
      this.recive = scopes;
      return scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      //history.push("/forbidden");
    }
  };
  updateRecive = async (Recive: reciveTracking) => {
    try {
      const data = await shipmentTracking.updaterecive(Recive);
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
      //history.push("/forbidden");
    }
  };
  printTicket = async (id: string) => {
    try {
      var response = await shipmentTracking.getById(id);
      await shipmentTracking.exportList(response);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
