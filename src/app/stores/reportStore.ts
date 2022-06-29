import { makeAutoObservable } from "mobx";
import Report from "../api/report";
import { IReportList } from "../models/report";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class ReportStore {
    constructor() {
        makeAutoObservable(this);
    }

    scopes?: IScopes;
    reports: IReportList[] = [];
    currentReport: string | undefined;
    clearScopes = () => {
        this.scopes = undefined;
    };
    setCurrentReport = (report?: string) => {
        this.currentReport = report;
      };

    clearReport = () => {
        this.reports = [];
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


    exportList = async (reportName: string, search: string) => {
        try {
            await Report.exportList(reportName, search);
        } catch (error: any) {
            alerts.warning(getErrors(error));
        }
    };

    getAll = async (reportName: string, search?: string) => {
        try {
          const reports = await Report.getAll(reportName, search);
          this.reports = reports;
        } catch (error: any) {
          alerts.warning(getErrors(error));
          this.reports = [];
        }
      };
    exportForm = async (id: string) => {
        try {
            await Report.exportForm(id);
        } catch (error: any) {
            if (error.status === responses.notFound) {
                history.push("/notFound");
            } else {
                alerts.warning(getErrors(error));
            }
        }
    };
}