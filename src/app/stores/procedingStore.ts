import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
import history from "../util/history";
import { IProceedingForm, IProceedingList, ISearchMedical, SearchMedicalFormValues } from "../models/Proceeding";
import Proceding from "../api/proceding";
import { ITaxForm } from "../models/taxdata";
export default class ProcedingStore {
  constructor() {
    makeAutoObservable(this);
  }
  expedientes: IProceedingList[] = [];
  expediente?: IProceedingForm;
  search: ISearchMedical=new SearchMedicalFormValues();
  tax:ITaxForm[]=[];
  setTax=(value:ITaxForm[])=>{
      this.tax=value
  };
  setSearch= (value:ISearchMedical)=>{
      this.search=value;
  };
  getAll = async (search: string = "all") => {
    try {
      console.log(search);
      const parameters = await Proceding.getAll(search);
      this.expedientes= parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.expedientes = [];
    }
  };
  getnow = async (search: ISearchMedical) => {
    try {
      console.log(search);
      const parameters = await Proceding.getNow(search);
      this.expedientes= parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.expedientes = [];
    }
  };
  getById = async (id: string) => {
    try {
      const rol = await Proceding.getById(id);
      console.log(rol);
      this.expediente = rol;
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        //history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
      //this.roles = [];
    }
  };

  coincidencias = async (parameter: IProceedingForm) => {
    try {
      console.log(parameter);
      console.log("here");
     var coincidencias= await Proceding.getcoincidencia(parameter);
      return coincidencias;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  create = async (parameter: IProceedingForm) => {
    try {
      console.log(parameter);
      console.log("here");
      await Proceding.create(parameter);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (parameter: IProceedingForm) => {
    try {
      await Proceding.update(parameter);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
 
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: ISearchMedical) => {
    try {
      await Proceding.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (id: string) => {
    try {
      await Proceding.exportForm(id);
      return true;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
