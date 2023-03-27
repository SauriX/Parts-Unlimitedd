import { makeAutoObservable } from "mobx";
import moment from "moment";
import MassResultSearch from "../api/massResultSearch";
import {
  IDeliverResultsForm,
  IMassSearch,
  IParameter,
  IResult,
  MassSearchValues,
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
  search: IMassSearch = new MassSearchValues();
  loadingStudies: boolean = false;

  setAreas = (area: string) => {
    this.area = area;
  };

  setFilter = (search: IMassSearch) => {
    this.search = search;
  };

  getRequestResults = async (search: IMassSearch) => {
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
  getAllCaptureResults = async (search: IDeliverResultsForm) => {
    try {
      const result = await MassResultSearch.getAllCaptureResults(search);
      this.requests = result;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  clearRequests = () => {
    this.requests = [];
  };

  formDeliverResult: any = { fechaInicial: moment(), fechaFinal: moment() };
  setFormDeliverResult = (form: any) => {
    this.formDeliverResult = form;
  };
  clearFormDeliverResult = () => {
    this.formDeliverResult = { fechaInicial: moment(), fechaFinal: moment() };
  };
  exportListDeliverResult = async (search: any) => {
    try {
      await MassResultSearch.exportListDeliverResult(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printPdf = async (search: IMassSearch) => {
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
