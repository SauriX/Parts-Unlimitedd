import { makeAutoObservable, reaction } from "mobx";
import ReportStudy from "../api/reportStudy";
import { IReportRequestInfo } from "../models/ReportRequest";
import { IRequestFilter, RequestFilterForm } from "../models/request";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class ReportStudyStore {
  constructor() {
    makeAutoObservable(this);
  }

  filter: IRequestFilter = new RequestFilterForm();

  requests: IReportRequestInfo[] = [];

  loadingRequests: boolean = false;
  lastViewedFrom?: { from: "requests" | "results"; code: string };

  setFilter = (filter: IRequestFilter) => {
    this.filter = { ...filter };
  };
  getRequests = async (filter: IRequestFilter) => {
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

   
  printPdf = async (filter: IRequestFilter) => {
    try {
  
      await ReportStudy.printPdf(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    } 
  };

  downloadList = async (filter: IRequestFilter) => {
    try {
  
      await ReportStudy.downloadList(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    } 
  };

}
