import { makeAutoObservable } from "mobx";
import moment from "moment";
import MassResultSearch from "../api/massResultSearch";
import { IGeneralForm } from "../models/general";
import {
  IDeliverResultsForm,
  IParameter,
  IResult,
} from "../models/massResultSearch";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class MassResultSearchStore {
  constructor() {
    makeAutoObservable(this);
  }

  area: string = "";
  results: IResult[] = [];
  parameters: IParameter[] = [];
  loadingStudies: boolean = false;

  setAreas = (area: string) => {
    this.area = area;
  };

  getRequestResults = async (search: IGeneralForm) => {
    try {
      this.loadingStudies = true;
      const result = await MassResultSearch.getRequestResults(search);
      this.parameters = result.parameters;
      this.results = result.results;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingStudies = false;
    }
  };

  requests: any[] = [];
  getAllCaptureResults = async (search: IGeneralForm) => {
    try {
      this.loadingStudies = true;
      const result = await MassResultSearch.getAllCaptureResults(search);
      this.requests = result;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingStudies = false;
    }
  };

  formDeliverResult: IGeneralForm = { fecha: [moment(), moment()] };
  setFormDeliverResult = (form: IGeneralForm) => {
    this.formDeliverResult = form;
  };

  exportListDeliverResult = async (search: IGeneralForm) => {
    try {
      await MassResultSearch.exportListDeliverResult(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printPdf = async (search: IGeneralForm) => {
    try {
      await MassResultSearch.printPdf(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printOrder = async (recordId: string, requestId: string) => {
    try {
      await MassResultSearch.getOrderPdf(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
