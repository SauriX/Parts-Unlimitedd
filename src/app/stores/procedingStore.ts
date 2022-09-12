import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
import history from "../util/history";
import {
  IProceedingForm,
  IProceedingList,
  ISearchMedical,
  SearchMedicalFormValues,
} from "../models/Proceeding";
import Proceding from "../api/proceding";
import { ITaxData } from "../models/taxdata";

export default class ProcedingStore {
  constructor() {
    makeAutoObservable(this);
  }

  expedientes: IProceedingList[] = [];
  // expediente?: IProceedingForm;
  search: ISearchMedical = new SearchMedicalFormValues();
  tax: ITaxData[] = [];

  setTax = (value: ITaxData[]) => {
    this.tax = value;
  };

  clearTax = () => {
    this.tax = [];
  };

  setSearch = (value: ISearchMedical) => {
    this.search = value;
  };

  getAll = async (search: string = "all") => {
    try {
      console.log(search);
      const parameters = await Proceding.getAll(search);
      this.expedientes = parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.expedientes = [];
    }
  };

  getnow = async (search: ISearchMedical) => {
    try {
      console.log(search);
      const parameters = await Proceding.getNow(search);
      this.expedientes = parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.expedientes = [];
    }
  };

  getTaxData = async (recordId: string) => {
    try {
      const taxData = await Proceding.getTaxData(recordId);
      return taxData;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  getById = async (id: string) => {
    try {
      const rol = await Proceding.getById(id);
      console.log(rol);
      // this.expediente = rol; // Comentado porque no se usa
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
  getByIdQuote = async (id: string) => {
    try {
      const rol = await Proceding.getById(id);
      console.log(rol);
      // this.expediente = rol; // Comentado porque no se usa
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
      var coincidencias = await Proceding.getcoincidencia(parameter);
      return coincidencias;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };
  activateWallet = async (
    id: string,
    saldo: number = 0,
    activo: boolean = true
  ) => {
    try {
      const response = await Proceding.updateWallet(id, saldo, activo);
      return response;
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

  createTaxData = async (taxData: ITaxData) => {
    try {
      const id = await Proceding.createTaxData(taxData);
      alerts.success(messages.created);
      return id;
    } catch (error: any) {
      alerts.warning(getErrors(error));
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

  updateTaxData = async (taxData: ITaxData) => {
    try {
      await Proceding.updateTaxData(taxData);
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
