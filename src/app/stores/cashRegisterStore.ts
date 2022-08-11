import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";
import moment from "moment";
import { CashRegisterFilterValues, ICashRegisterData, ICashRegisterFilter } from "../models/cashRegister";
import CashRegister from "../api/cashRegister";

export default class CashRegisterStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  filter: ICashRegisterFilter = new CashRegisterFilterValues();
  clear: boolean = false;
  cashRegisterData: ICashRegisterData[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  setFilter = (filter: ICashRegisterFilter) => {
    this.filter = filter;
  };

  clearFilter = () => {
    const emptyFilter: ICashRegisterFilter = {
      sucursalId: [],
      tipoCompañia: [],
      fecha: moment(Date.now()),
      hora: [moment().hour(0), moment().hour(23)],
    };
    this.filter = emptyFilter;
    this.clear = !this.clear;
  };

  access = async () => {
    try {
      const scopes = await CashRegister.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getByFilter = async (filter: ICashRegisterFilter) => {
    try {
      const data = await CashRegister.getByFilter(filter);
      this.cashRegisterData = data;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.cashRegisterData = [];
    }
  };

  printPdf = async (filter: ICashRegisterFilter) => {
    try {
      await CashRegister.printPdf(filter);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
