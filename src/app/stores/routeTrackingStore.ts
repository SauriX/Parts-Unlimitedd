import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import Sampling from "../api/sampling";
import {
  IRouteTrackingList,
  ITagTrackingOrder,
  ISearchTracking,
  PendingSendValues,
} from "../models/routeTracking";
import responses from "../util/responses";
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
  routeTrackingFilter: ISearchTracking = new PendingSendValues();

  sendStudyTags: IRouteTrackingList[] = [];
  tagCreateData: ITagTrackingOrder[] = [];
  shipmentList: IRouteTrackingList[] = [];
  tags: ITagTrackingOrder[] = [];

  routeTags: ITagTrackingOrder[] = [];
  routeStudies: IStudyTrackinOrder[] = [];
  tagsSelected: ITagTrackingOrder[] = [];

  receiveStudyTags: IRouteTrackingList[] = [];

  trackingStatus = { timeLine: false, trackingStatus: 0 };

  loadingRoutes: boolean = false;
  scan: boolean = false;

  setRouteTrackingFilter = (routeTrackingFilter: ISearchTracking) => {
    this.routeTrackingFilter = routeTrackingFilter;
  };

  setRouteStudies = (routeStudies: IStudyTrackinOrder[]) => {
    this.routeStudies = routeStudies;
  };

  setTagCreateData = (tagCreateData: ITagTrackingOrder[]) => {
    this.tagCreateData = tagCreateData;
  };

  setTagsSelected = (tagsSelected: ITagTrackingOrder[]) => {
    this.tagsSelected = tagsSelected;
  };

  getStudyTrackingOrder = (record: ITagTrackingOrder) => {
    const studyTrackingOrder: IStudyTrackinOrder = {
      etiquetaId: record.id,
      solicitudId: record.solicitudId,
      claveEtiqueta: record.claveEtiqueta,
      claveRuta: record.claveRuta,
      cantidad: record.cantidad,
      estudios: record.estudios,
      solicitud: record.solicitud,
      recipiente: record.recipiente,
      estatus: record.estatus,
      escaneo: record.escaneo,
      extra: record.extra,
    };
    return studyTrackingOrder;
  };

  setScan = (scan: boolean) => {
    this.scan = scan;
  };

  setTrackingStatus = (timeLine: boolean, trackingStatus: number) => {
    this.trackingStatus = { timeLine, trackingStatus };
  };

  clearScopes = () => {
    this.scopes = undefined;
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

  getAllPendingSend = async (search: ISearchTracking) => {
    try {
      this.loadingRoutes = true;
      const study = await RouteTracking.getAllPendingSend(search);
      this.sendStudyTags = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.sendStudyTags = [];
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

  getAllPendingReceive = async (search: ISearchTracking) => {
    try {
      this.loadingRoutes = true;
      const study = await RouteTracking.getAllPendingReceive(search);
      this.receiveStudyTags = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.receiveStudyTags = [];
    } finally {
      this.loadingRoutes = false;
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

  getActive = async () => {
    try {
      this.loadingRoutes = true;
      const trackingOrders = await RouteTracking.getActive();
      this.shipmentList = trackingOrders;
      return trackingOrders;
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

  updateTrackingOrder = async (order: IRouteTrackingForm) => {
    try {
      await RouteTracking.updateTrackingOrder(order);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportFormPending = async (id: ISearchTracking) => {
    try {
      await RouteTracking.exportReceiveForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  exportForm = async (id: string) => {
    try {
      await RouteTracking.exportTrackingOrderForm(id);
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
