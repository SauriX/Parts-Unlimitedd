import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import Sampling from "../api/sampling";
import { ISamplingForm, ISamplingList, IUpdate } from "../models/sampling";
import {
  IRouteTrackingList,
  SearchTracking,
  TrackingFormValues,
} from "../models/routeTracking";
import RouteTracking from "../api/routetracking";
import responses from "../util/responses";
import { IRecibe, ISearchPending, searchValues } from "../models/pendingRecive";

export default class RouteTrackingStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  studys: IRouteTrackingList[] = [];
  pendings?: IRecibe[] = [];
  ventana: string = "enviar";
  searchPending?: ISearchPending = new searchValues();
  searchrecive: SearchTracking = new TrackingFormValues();
  loadingRoutes: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };
  setventana = (ventana: string) => {
    this.ventana = ventana;
  };
  clearStudy = () => {
    this.studys = [];
  };
  setSearchi = (search: ISearchPending) => {
    this.searchPending = search;
  };
  setSearchRecive = (search: SearchTracking) => {
    this.searchrecive = search;
  };
  access = async () => {
    try {
      const scopes = await Sampling.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: SearchTracking) => {
    try {
      this.loadingRoutes = true;
      const study = await RouteTracking.getAll(search);
      let orderStudy = study.sort((x, y) => {
        return x.seguimiento.localeCompare(y.seguimiento);
      });
      this.studys = orderStudy;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.studys = [];
    } finally {
      this.loadingRoutes = false;
    }
  };
  getAllRecive = async (search: ISearchPending) => {
    try {
      const study = await RouteTracking.getRecive(search);
      this.pendings = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.pendings = [];
    }
  };
  exportFormPending = async (id: ISearchPending) => {
    try {
      await RouteTracking.exportFormpending(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  update = async (study: IUpdate[]) => {
    try {
      await RouteTracking.update(study);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  exportForm = async (id: string) => {
    try {
      await RouteTracking.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  printTicket = async (recordId: string, requestId: string) => {
    try {
      await Sampling.getOrderPdf(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
