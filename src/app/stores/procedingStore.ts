import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
import history from "../util/history";
import { IProceedingForm, IProceedingList } from "../models/Proceeding";
import Proceding from "../api/proceding";
import { ITaxData } from "../models/taxdata";
import quotation from "../api/quotation";
import Study from "../api/study";
import { IQuotationFilter, IQuotationInfo } from "../models/quotation";
import { IGeneralForm } from "../models/general";

export default class ProcedingStore {
  constructor() {
    makeAutoObservable(this);
  }

  expedientes: IProceedingList[] = [];
  expediente?: IProceedingForm;
  tax: ITaxData[] = [];
  searchQ: any;
  quotatios: IQuotationInfo[] = [];
  recordId: string = "";

  getAllQ = async (searchQ: IQuotationFilter) => {
    try {
      const reagents = await Proceding.getNowQ(searchQ);

      this.quotatios = reagents;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.quotatios = [];
    }
  };
  getParameter = async (id: number) => {
    try {
      const reagent = await Study.getById(id);
      return reagent;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  getByIdQ = async (id: string) => {
    try {
      const reagent = await quotation.getGeneral(id);
      return reagent;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  setTax = (value: ITaxData[]) => {
    this.tax = value;
  };

  clearTax = () => {
    this.tax = [];
  };

  getAll = async (search: string = "all") => {
    try {
      const parameters = await Proceding.getAll(search);
      this.expedientes = parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.expedientes = [];
    }
  };

  getnow = async (filter: IGeneralForm) => {
    try {
      const parameters = await Proceding.getNow(filter);
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
      rol.edad = "" + rol.edad;
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  getByIdQuote = async (id: string) => {
    try {
      const rol = await Proceding.getById(id);
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  coincidencias = async (parameter: IProceedingForm) => {
    try {
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
      await Proceding.updateWallet(id, saldo, activo);
      alerts.success(messages.activeWallet);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  create = async (parameter: IProceedingForm) => {
    try {
      const record = await Proceding.create(parameter);
      this.expedientes.push(record);
      alerts.success(messages.created);
      return record.id;
    } catch (error: any) {
      this.recordId = "";
      alerts.warning(getErrors(error));
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
  setDefaultTaxData = async (taxDataId: string) => {
    try {
      await Proceding.setDefaultTaxData(taxDataId);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  updateObservation = async (observation: any) => {
    try {
      await Proceding.updateObservation(observation);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: IGeneralForm) => {
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
