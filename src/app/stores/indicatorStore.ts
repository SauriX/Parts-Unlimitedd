import { makeAutoObservable } from "mobx";
import Indicators from "../api/indicators";
import {
  IIndicatorsData,
  IndicatorFilterValues,
  IndicatorsData,
  IReportIndicators,
  IReportIndicatorsFilter,
} from "../models/indicators";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";

export default class IndicatorStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  filter: IReportIndicatorsFilter = new IndicatorFilterValues();
  data: IReportIndicators[] = [];
  indicatorsData: IIndicatorsData = new IndicatorsData()

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
      const data = await Indicators.getByFilter(filter);
      this.data = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.data = [];
    }
  };

  printPdf = async (filter: IReportIndicatorsFilter) => {
    try {
      await Indicators.printPdf(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
