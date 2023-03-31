import { makeAutoObservable } from "mobx";
import Report from "../api/report";
import {
  IReportFilter,
  IReportData,
  ReportFilterValues,
} from "../models/report";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";
import { reportType } from "../../components/report/utils";
import moment from "moment";

export default class ReportStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  currentReport?: reportType;
  filter: IReportFilter = new ReportFilterValues();
  reportData: IReportData[] = [];
  chartData: any[] = [];
  tableData: any[] = [];
  loadingReport: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };

  setCurrentReport = (name?: reportType) => {
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
      this.loadingReport = true;
      const data = await Report.getByFilter(report, filter);
      this.reportData = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.reportData = [];
    } finally {
      this.loadingReport = false;
    }
  };

  getByChart = async <T extends unknown>(
    report: string,
    filter: IReportFilter
  ) => {
    try {
      this.loadingReport = true;
      const data = await Report.getByChart<T>(report, filter);
      this.chartData = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.reportData = [];
    } finally {
      this.loadingReport = false;
    }
  };

  getByTable = async <T extends unknown>(
    report: string,
    filter: IReportFilter
  ) => {
    try {
      this.loadingReport = true;
      const data = await Report.getByTable<T>(report, filter);
      this.tableData = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.reportData = [];
    } finally {
      this.loadingReport = false;
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
