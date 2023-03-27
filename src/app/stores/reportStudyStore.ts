import { makeAutoObservable, reaction } from "mobx";
import ReportStudy from "../api/reportStudy";
import { IGeneralForm } from "../models/general";
import { IReportRequestInfo } from "../models/ReportRequest";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class ReportStudyStore {
  constructor() {
    makeAutoObservable(this);
  }

  requests: IReportRequestInfo[] = []
  loadingRequests: boolean = false;
  lastViewedFrom?: { from: "requests" | "results"; code: string };

  getRequests = async (filter: IGeneralForm) => {
    try {
      this.loadingRequests = true;
      const requests = await ReportStudy.getRequests(filter);
      this.requests = requests;
      return requests;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingRequests = false;
    }
  };

  printPdf = async (filter: IGeneralForm) => {
    try {
      await ReportStudy.printPdf(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  downloadList = async (filter: IGeneralForm) => {
    try {
      await ReportStudy.downloadList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
