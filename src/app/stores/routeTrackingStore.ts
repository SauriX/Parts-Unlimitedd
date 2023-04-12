import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import Sampling from "../api/sampling";
import { IUpdate } from "../models/sampling";
import {
  IRouteTrackingList,
  ITagTrackingOrder,
  SearchTracking,
  TrackingFormValues,
} from "../models/routeTracking";
import responses from "../util/responses";
import { IRecibe, ISearchPending, searchValues } from "../models/pendingRecive";
import {
  IRouteTrackingForm,
  IStudyTrackinOrder,
} from "../models/trackingOrder";
import RouteTracking from "../api/routetracking";

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
  scan: boolean = false;

  routeTags: ITagTrackingOrder[] = [];
  routeStudies: IStudyTrackinOrder[] = [];
  tagsSelected: ITagTrackingOrder[] = [];

  setRouteStudies = (routeStudies: IStudyTrackinOrder[]) => {
    this.routeStudies = routeStudies;
  };

  setTagsSelected = (tagsSelected: ITagTrackingOrder[]) => {
    this.tagsSelected = tagsSelected;
  };

  setScan = (scan: boolean) => {
    this.scan = scan;
  };

  clearScopes = () => {
    this.scopes = undefined;
  };

  setventana = (ventana: string) => {
    this.ventana = ventana;
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
      this.studyTags = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.studyTags = [];
    } finally {
      this.loadingRoutes = false;
    }
  };

  getById = async (id: string) => {
    try {
      this.loadingRoutes = true;
      const order = await RouteTracking.getById(id);
      return order;
    } catch (error) {
      alerts.warning(getErrors(error));
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
      this.loadingRoutes = true;
      const tags = await RouteTracking.getFindTags(routeId);
      this.tags = tags;
      return tags;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    } finally {
      this.loadingRoutes = false;
    }
  };

  getRequestTags = async (search: string) => {
    try {
      this.loadingRoutes = true;
      const tags = await RouteTracking.getRequestTags(search);
      this.tags = tags;
      return tags;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    } finally {
      this.loadingRoutes = false;
    }
  };

  createTrackingOrder = async (order: IRouteTrackingForm) => {
    try {
      await RouteTracking.createTrackingOrder(order);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
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
