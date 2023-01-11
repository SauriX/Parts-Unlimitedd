import { makeAutoObservable } from "mobx";
import Indicators from "../api/indicators";
import {
  IndicatorFilterValues,
  IReportIndicators,
  IReportIndicatorsFilter,
  ISamplesCost,
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
  data: IReportIndicators[] = [];
  samples: ISamplesCost[] = [];
  loadingReport: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };

  setFilter = (filter: IReportIndicatorsFilter) => {
    this.filter = filter;
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

  getSamplesCostsByFilter = async (filter: IReportIndicatorsFilter) => {
    try{
      this.loadingReport = true;
      this.data = [];
      const data = await Indicators.getSamplesCostsByFilter(filter);
      this.data = data;
    } catch (error: any){
      alerts.warning(getErrors(error));
      this.data = [];
    } finally {
      this.loadingReport = false;
    }
  }

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

  getServicesCost = async (filter: IReportIndicatorsFilter) => {
    try {
      const data = await Indicators.getServicesCost(filter);
      this.data = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.data = [];
    }
  };

  exportList = async (filter: IReportIndicatorsFilter) => {
    try {
      await Indicators.exportList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportSamplingList = async (filter: IReportIndicatorsFilter) => {
    try {
      await Indicators.exportSamplingList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportServiceList = async (filter: IReportIndicatorsFilter) => {
    try {
      await Indicators.exportServiceList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
