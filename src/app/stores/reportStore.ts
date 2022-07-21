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
  reportData: IReportData[] = [
    {
      id: "3568",
      expediente: "358",
      sucursal: "Salinas",
      paciente: "Mauricio Pola",
      medico: "Esteban Lopez",
      claveMedico: "345",
      noSolicitudes: "2",
      fecha: new Date(),
      total: "765",
      noPacientes: "2",
    },
    {
      id: "435345345",
      expediente: "32423",
      sucursal: "Juarez",
      paciente: "Carlos Reyes",
      medico: "Luis Gonzales",
      claveMedico: "2326",
      noSolicitudes: "5",
      fecha: new Date(),
      total: "4634",
      noPacientes: "456",
    },
  ];

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

  printPdf = async (report: string, filter: IReportFilter) => {
    try {
      await Report.printPdf(report, filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
