import Search from "antd/lib/transfer/search";
import { makeAutoObservable } from "mobx";
import { getParsedCommandLineOfConfigFile } from "typescript";
import TrackingOrder from "../api/trackingOrder";
import {
  ITrackingOrderForm,
  ITrackingOrderList,
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
  trackingOrder: ITrackingOrderList[] = [];

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

  getById = async (id: number) => {
    try {
      const trackingOrder = await TrackingOrder.getById(id);
      return trackingOrder;
    } catch (error) {
      console.log(error);
      alerts.warning(getErrors(error));
    }
  };

  create = async (trackingOrder: ITrackingOrderForm) => {
    try {
      await TrackingOrder.create(trackingOrder);
      alerts.success(messages.created);
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

  exportList = async (search: string) => {
    try {
      await TrackingOrder.exportList(search);
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
