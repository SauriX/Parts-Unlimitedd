import { makeAutoObservable } from "mobx";
import PatientStatistic from "../api/patient_statistic";
import {IPatientStatisticForm, IPatientStatisticList, PatientStatisticFormValues} from "../models/patient_statistic";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class PatientStaticStore {
    constructor() {
        makeAutoObservable(this);
    }
    search: IPatientStatisticForm = new PatientStatisticFormValues();
    scopes?: IScopes;
    statsreport: IPatientStatisticList[] = [];
    currentReport: string | undefined;
    clearScopes = () => {
        this.scopes = undefined;
    };
    setCurrentReport = (report?: string) => {
        this.currentReport = report;
    };

    clearReport = () => {
        this.statsreport = [];
    };

    access = async () => {
        try {
            const scopes = await PatientStatistic.access();
            this.scopes = scopes;
            return scopes;
        } catch (error: any) {
            alerts.warning(getErrors(error));
            history.push("/forbidden");
        }
    };

    exportList = async (catalogName: string, search: string) => {
        try {
            await PatientStatistic.exportList(catalogName, search);
        } catch (error: any) {
            alerts.warning(getErrors(error));
        }
    };

    getAll = async (reportName: string, search?: string) => {
        try{
            const statsreport = await PatientStatistic.getAll(reportName, search);
            this.statsreport = statsreport;
        } catch (error: any) {
            alerts.warning(getErrors(error));
            this.statsreport = [];
        }
    };

    getBranchByCount = async () => {
        try {
            const statsreport = await PatientStatistic.getBranchByCount();
            this.statsreport = statsreport;
        } catch (error: any) {
            alerts.warning(getErrors(error));
            this.statsreport = [];
        }
    };

    exportForm = async (id: string) => {
        try {
            await PatientStatistic.exportForm(id);
        } catch (error: any) {
            if (error.status === responses.notFound) {
                history.push("/notFound");
            } else {
                alerts.warning(getErrors(error));
            }
        }
    };

    setSearch = (value: IPatientStatisticForm) => {
        this.search = value;
    }

    filtro = async (search: IPatientStatisticForm) => {
        try {
            console.log(search);
            const statsreport = await PatientStatistic.filtro(search);
            this.statsreport = statsreport;
        } catch (error: any) {
            alerts.warning(getErrors(error));
            this.statsreport = [];
        }
    }
}