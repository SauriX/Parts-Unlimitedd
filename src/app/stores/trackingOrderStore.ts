import {
  TrackingOrderFormValues,
  TrackingOrderListValues,
} from "./../models/trackingOrder";
import Search from "antd/lib/transfer/search";
import { makeAutoObservable } from "mobx";
import { getParsedCommandLineOfConfigFile } from "typescript";
import TrackingOrder from "../api/trackingOrder";
import {
  ITrackingOrderForm,
  ITrackingOrderList,
  IEstudiosList,
} from "../models/trackingOrder";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class TrackingOrdertStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  trackingOrder: IEstudiosList[] = [];
  trackingOrderStudies: ITrackingOrderList[] = [];
  estudios: IEstudiosList[] = [];
  temperatura: number = 0;
  TranckingOrderSend: ITrackingOrderForm = new TrackingOrderFormValues();
  setSendData = (tranckingOrderSend: ITrackingOrderForm) => {
    this.TranckingOrderSend = tranckingOrderSend;
  };
  setTemperatura = (temepratura: number) => {
    this.temperatura = temepratura;
  };
  confirmarRecoleccionSend = async () => {
    try {
      await TrackingOrder.confirmarRecoleccion(this.OrderId);
      await this.getById(this.OrderId);
      alerts.success("Se confirmo exitosmente la orden");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
  cancelarRecoleccionSend = async () => {
    try {
      await TrackingOrder.cancelarRecoleccion(this.OrderId);
      await this.getById(this.OrderId);
      alerts.success("Se cancelo exitosmente la orden");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
  setEscaneado = (escaneado: boolean, id: string) => {
    try {
      const estudios = this.trackingOrder.map((estudio) => {
        let a = new TrackingOrderListValues(estudio);
        if (a.id === id) {
          a.escaneado = escaneado;
          if (!escaneado) {
            a.temperatura = 0;
          } else {
            a.temperatura = this.temperatura!;
          }
        }
        return a;
      });
      this.trackingOrder = estudios;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
  setTemperature = (temperature: number, id: string | null = null) => {
    try {
      if (id) {
        const index = this.trackingOrder.findIndex((x) => x.id === id);
        if (index !== -1) {
          const trackingOrder = this.trackingOrder[index];
          this.trackingOrder[index] = {
            ...trackingOrder,
            temperatura: temperature,
          };
        }
      } else {
        const estudios = this.trackingOrder.map((estudio) => {
          if (estudio.escaneado) {
            estudio.temperatura = temperature;
          }

          return estudio;
        });
        this.trackingOrder = estudios;
      }
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  getStudiesByStudiesRoute = async (studyId: number[]) => {
    try {
      const studies = await TrackingOrder.findStudies(studyId);

      this.trackingOrder = studies.map((x) => {
        let a = new TrackingOrderListValues(x);

        return a;
      });
    } catch (error) {
      alerts.warning(getErrors(error));
      this.trackingOrder = [];
    }
  };
  clearScopes = () => {
    this.scopes = undefined;
  };

  clearTrackingOrders = () => {
    this.trackingOrder = [];
  };

  access = async () => {
    try {
      const scopes = await TrackingOrder.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const trackingOrder = await TrackingOrder.getAll(search);
      this.trackingOrder = trackingOrder;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.trackingOrder = [];
    }
  };

  getById = async (id: string) => {
    try {
      const trackingOrder = await TrackingOrder.getById(id);
      this.OrderId = trackingOrder.id!;
      this.trackingOrder = trackingOrder.estudiosAgrupados!.map((x: any) => {
        let a = new TrackingOrderListValues(x);
        a.escaneado = true;
        return a;
      });
      return trackingOrder;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
  OrderCreated = "";
  OrderId = "";
  create = async (trackingOrder: ITrackingOrderForm) => {
    try {
      const orderCreated = await TrackingOrder.create(trackingOrder);
      this.OrderCreated = orderCreated.clave;
      this.OrderId = orderCreated.id;
      alerts.success("Se creo exitosmente la orden: " + this.OrderCreated);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (trackingOrder: ITrackingOrderForm) => {
    try {
      await TrackingOrder.update(trackingOrder);
      alerts.success(messages.updated);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async () => {
    try {
      if (!!this.OrderId) {
        await TrackingOrder.exportList(this.TranckingOrderSend);
      }
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: number) => {
    try {
      await TrackingOrder.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
