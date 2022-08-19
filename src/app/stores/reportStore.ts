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
  clear: boolean = false;
  reportData: IReportData[] = [];
  chartData: any[] = [];
  tableData: any[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  setCurrentReport = (name?: reportType) => {
    this.currentReport = name;
  };

  setFilter = (filter: IReportFilter) => {
    this.filter = filter;
  };

  clearFilter = () => {
    const emptyFilter: IReportFilter = {
      sucursalId: [],
      medicoId: [],
      compañiaId: [],
      metodoEnvio: [],
      tipoCompañia: [],
      urgencia: [],
      fecha: [moment(Date.now()).utcOffset(0, true), moment(Date.now()).utcOffset(0, true).add(1, "day")],
      grafica: false,
    };
    this.reportData = [];
    this.filter = emptyFilter;
    this.clear = !this.clear;
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

  getByChart = async <T extends unknown>(
    report: string,
    filter: IReportFilter
  ) => {
    try {
      const data = await Report.getByChart<T>(report, filter);
      this.chartData = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.reportData = [];
    }
  };

  getByTable = async <T extends unknown>(
    report: string,
    filter: IReportFilter
  ) => {
    try {
      const data = await Report.getByTable<T>(report, filter);
      this.tableData = data;
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
