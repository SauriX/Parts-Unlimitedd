import { makeAutoObservable } from "mobx";
import Indicators from "../api/indicators";
import {
  IModalIndicatorsFilter,
  IndicatorFilterValues,
  IReportIndicators,
  IReportIndicatorsFilter,
  ISamplesCost,
  IServicesCost,
  IServicesInvoice,
  IUpdateService,
  ModalIndicatorFilterValues,
  ServiceInvoice,
  ServicesCost,
} from "../models/indicators";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class IndicatorStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  filter: IReportIndicatorsFilter = new IndicatorFilterValues();
  modalFilter: IModalIndicatorsFilter = new ModalIndicatorFilterValues();
  data: IReportIndicators[] = [];
  samples: ISamplesCost[] = [];
  servicesCost: IServicesCost[] = [];
  services: IServicesInvoice = new ServiceInvoice();
  loadingReport: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };

  setServicesCost = (servicesCost: IServicesCost[]) => {
    this.servicesCost = servicesCost;
  };

  setFilter = (filter: IReportIndicatorsFilter) => {
    this.filter = filter;
  };

  setModalFilter = (modalFilter: IModalIndicatorsFilter) => {
    this.modalFilter = modalFilter;
  };

  deleteServiceCost = async (id: string) => {
    this.servicesCost = this.servicesCost.filter((x) => x.identificador !== id);
  };

  access = async () => {
    try {
      const scopes = await Indicators.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getByFilter = async (filter: IReportIndicatorsFilter) => {
    try {
      this.loadingReport = true;
      this.data = [];
      const data = await Indicators.getByFilter(filter);
      this.data = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.data = [];
    } finally {
      this.loadingReport = false;
    }
  };

  getSamplesCostsByFilter = async (filter: IModalIndicatorsFilter) => {
    try {
      this.loadingReport = true;
      this.samples = [];
      const samples = await Indicators.getSamplesCostsByFilter(filter);
      this.samples = samples;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.samples = [];
    } finally {
      this.loadingReport = false;
    }
  };

  create = async (indicators: IReportIndicators) => {
    try {
      await Indicators.create(indicators);
      alerts.success(messages.created);

      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (indicators: IReportIndicators) => {
    try {
      await Indicators.update(indicators);
      alerts.success(messages.created);

      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateSample = async (samples: ISamplesCost) => {
    try {
      await Indicators.updateSampleCost(samples);
      alerts.success(messages.created);

      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateService = async (updateService: IUpdateService) => {
    try {
      this.loadingReport = true;
      await Indicators.updateServiceCost(updateService);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingReport = false;
    }
  };

  getForm = async (indicators: IReportIndicators) => {
    try {
      await Indicators.getForm(indicators);
      alerts.success(messages.updated);

      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getServicesCost = async (filter: IModalIndicatorsFilter) => {
    try {
      this.loadingReport = true;
      this.services = new ServiceInvoice();
      const services = await Indicators.getServicesCost(filter);
      this.services = services;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingReport = false;
    }
  };

  saveFile = async (file: FormData) => {
    try {
      var fileName = await Indicators.saveFile(file);
      alerts.success(messages.created);
      return fileName;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  exportList = async (filter: IReportIndicatorsFilter) => {
    try {
      await Indicators.exportList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportSamplingList = async (filter: IModalIndicatorsFilter) => {
    try {
      await Indicators.exportSamplingList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportServiceList = async (filter: IModalIndicatorsFilter) => {
    try {
      await Indicators.exportServiceList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportServiceListExample = async () => {
    try {
      await Indicators.exportServiceListExample();
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
