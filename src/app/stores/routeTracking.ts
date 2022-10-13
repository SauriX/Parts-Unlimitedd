import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import Sampling from "../api/sampling";
import { IsamplingForm, IsamplingList, IUpdate } from "../models/sampling";
import { IRouteList, SearchTracking } from "../models/routeTracking";
import RouteTracking from "../api/routetracking";
import responses from "../util/responses";
import { IRecibe, ISearchPending, searchValues } from "../models/pendingRecive";

export default class RouteTrackingStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  studys: IRouteList[] = [];
  pendings?:IRecibe[]=[];
  ventana:string="enviar";
  searchPending?:ISearchPending = new searchValues();
  clearScopes = () => {
    this.scopes = undefined;
  };
setventana=(ventana:string)=>{
  this.ventana=ventana
};
  clearStudy = () => {
    this.studys = [];
  };
  setSearchi= (search:ISearchPending)=>{
    this.searchPending=search;
  };
  access = async () => {
    try {
      const scopes = await Sampling.access();
      this.scopes = scopes;
      console.log(scopes);
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: SearchTracking) => {
    try {
      const study = await RouteTracking.getAll(search);
      this.studys = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.studys = [];
    }
  };
  getAllRecive = async (search: ISearchPending) => {
    try {
      const study = await RouteTracking.getRecive(search);
      this.pendings= study;
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
    console.log("this.update");
    console.log(study);
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
