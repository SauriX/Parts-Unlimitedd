import { makeAutoObservable, toJS } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import Sampling from "../api/sampling";
import { ISamplingForm, ISamplingList, IUpdate } from "../models/sampling";
import {
  IRouteTrackingList,
  ITagTrackingOrder,
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
  studyTags: IRouteTrackingList[] = [];
  tags: ITagTrackingOrder[] = [];
  pendings?: IRecibe[] = [];
  ventana: string = "enviar";
  searchPending?: ISearchPending = new searchValues();
  filterSend: SearchTracking = new TrackingFormValues();
  loadingRoutes: boolean = false;

  tagsSelected: ITagTrackingOrder[] = [];

  setTagsSelected = (tagsSelected: ITagTrackingOrder[]) => {
    this.tagsSelected = tagsSelected;
  };

  clearScopes = () => {
    this.scopes = undefined;
  };
  setventana = (ventana: string) => {
    this.ventana = ventana;
  };
  clearStudy = () => {
    this.studyTags = [];
  };

  setSearchi = (search: ISearchPending) => {
    this.searchPending = search;
  };

  setFilterSend = (filterSend: SearchTracking) => {
    this.filterSend = filterSend;
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
      this.studyTags = orderStudy;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.studyTags = [];
    } finally {
      this.loadingRoutes = false;
    }
  };

  getAllTags = async (search: string) => {
    try {
      this.loadingRoutes = true;
      const tags = await RouteTracking.getAllTags(search);
      this.tags = tags;
      return tags;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.tags = [];
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

  getFindTags = async (routeId: string) => {
    try {
      const tags = await RouteTracking.getFindTags(routeId);
      this.tags = tags;
      return tags;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
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
