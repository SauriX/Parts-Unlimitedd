import { makeAutoObservable } from "mobx";
import MassResultSearch from "../api/massResultSearch";
import {
  IDeliverResultsForm,
  IMassSearch,
  IParameter,
  IResult,
  IResultList,
} from "../models/massResultSearch";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class MassResultSearchStore {
  constructor() {
    makeAutoObservable(this);
    // set: (newFormValues: IMassSearch) => {};
  }

  area: string = "";
  results: IResult[] = [];
  parameters: IParameter[] = [];

  setAreas = (area: string) => {
    this.area = area;
    console.log("area store", this.area);
  };

  getRequestResults = async (search: IMassSearch) => {
    try {
      const result = await MassResultSearch.getRequestResults(search);
      this.parameters = result.parameters;
      if (result.parameters.length < 8) {
        let faltantes = 8 - result.parameters.length;
        for (let i = 0; i < faltantes; i++) {
          this.parameters.push({ nombre: "", etiqueta: "", unidades: "" });
        }
      }
      this.results = result.results;
      console.log("RESULT", result);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  requests: any[] = [];
  getAllCaptureResults = async (search: IDeliverResultsForm) => {
    try {
      const result = await MassResultSearch.getAllCaptureResults(search);
      this.requests = result;
      console.log("RESULT", result);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
