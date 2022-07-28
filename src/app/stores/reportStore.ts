import { makeAutoObservable } from "mobx";
import Report from "../api/report";
import { IReportFilter, IReportData, ReportFilterValues } from "../models/report";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";

export default class ReportStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  currentReport?: string;
  filter: IReportFilter = new ReportFilterValues();
  reportData: IReportData[] = [];
  chartData: any[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  setCurrentReport = (name?: string) => {
    this.currentReport = name;
  };

  setFilter = (filter: IReportFilter) => {
    this.filter = filter;
  };

  access = async () => {
    try {
      const scopes = await Report.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getByFilter = async (report: string, filter: IReportFilter) => {
    try {
      const data = await Report.getByFilter(report, filter);
      this.reportData = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.reportData = [];
    }
  };

  getByChart = async <T extends unknown>(report: string, filter: IReportFilter) => {
    try {
      const data = await Report.getByChart<T>(report, filter);
      this.chartData = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.reportData = [];
    }
  };

  printPdf = async (report: string, filter: IReportFilter) => {
    try {
      await Report.printPdf(report, filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
