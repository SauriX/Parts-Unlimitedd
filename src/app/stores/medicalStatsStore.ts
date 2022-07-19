import { makeAutoObservable } from "mobx";
import MedicalStats from "../api/medicalstats";
import {IMedicalStatsForm, IMedicalStatsList, MedicalStatsFormValues} from "../models/medical_stats";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class MedicalStatsStore {
    constructor() {
        makeAutoObservable(this); 
    }
    search: IMedicalStatsForm = new MedicalStatsFormValues();
    scopes?: IScopes;
    statsreport: IMedicalStatsList[] = [];
    currentReport: string | undefined;
    medicalPdfFilter?: IMedicalStatsForm = new MedicalStatsFormValues();
    clearScopes = () => {
        this.scopes = undefined;
    };
    setCurrentReport = (report?: string) => {
        this.currentReport = report;
    };

    clearReport = () => {
        this.statsreport = [];
    };

    setFilter = (search: IMedicalStatsForm) => {
        this.medicalPdfFilter = search;
    };

    access = async () => {
        try {
            const scopes = await MedicalStats.access();
            this.scopes = scopes;
            return scopes;
        } catch (error: any) {
            alerts.warning(getErrors(error));
            history.push("/forbidden");
        }
    };

    exportList = async (catalogName: string, search: string) => {
        try {
            await MedicalStats.exportList(catalogName, search);
        } catch (error: any) {
            alerts.warning(getErrors(error));
        }
    };

    printPdf = async (search?: IMedicalStatsForm) => {
        try{
            await MedicalStats.printPdf(search);
        } catch (error: any) {
            alerts.warning(getErrors(error));
            this.statsreport = []
        }
    }

    getAll = async (reportName: string, search?: string) => {
        try{
            const statsreport = await MedicalStats.getAll(reportName, search);
            this.statsreport = statsreport;
        } catch (error: any) {
            alerts.warning(getErrors(error));
            this.statsreport = [];
        }
    };

    getByDoctor = async () => {
        try {
            const statsreport = await MedicalStats.getByDoctor();
            this.statsreport = statsreport;
        } catch (error: any) {
            alerts.warning(getErrors(error));
            this.statsreport = [];
        }
    };

    exportForm = async (id: string) => {
        try {
            await MedicalStats.exportForm(id);
        } catch (error: any) {
            if (error.status === responses.notFound) {
                history.push("/notFound");
            } else {
                alerts.warning(getErrors(error));
            }
        }
    };

    setSearch = (value: IMedicalStatsForm) => {
        this.search = value;
    }

    filtro = async (search: IMedicalStatsForm) => {
        try {
            console.log(search);
            const statsreport = await MedicalStats.filtro(search);
            this.statsreport = statsreport;
            this.setFilter(search);
        } catch (error: any) {
            alerts.warning(getErrors(error));
            this.statsreport = [];
        }
    }
}