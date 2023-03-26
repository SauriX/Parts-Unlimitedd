import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";
import moment from "moment-timezone";
import {
  CashRegisterData,
  CashRegisterFilterValues,
  ICashRegisterData,
  ICashRegisterFilter,
} from "../models/cashRegister";
import CashRegister from "../api/cashRegister";

export default class CashRegisterStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  filter: ICashRegisterFilter = new CashRegisterFilterValues();
  clear: boolean = false;
  cashRegisterData: ICashRegisterData = new CashRegisterData();
  showChart: boolean = false

  clearScopes = () => {
    this.scopes = undefined;
  };

  setFilter = (filter: ICashRegisterFilter) => {
    this.filter = filter;
  };

  setShowChart = (showChart: boolean) => {
    this.showChart = showChart;
  };

  clearFilter = () => {
    const emptyFilter: ICashRegisterFilter = {
      sucursalId: [],
      tipoCompañia: [],
      fechaIndividual: moment(Date.now()).utcOffset(0, true),
      hora: [
        moment().hour(7).minutes(0).utcOffset(0, true),
        moment().hour(19).minutes(0).utcOffset(0, true),
      ],
    };
    this.filter = emptyFilter;
    this.clear = !this.clear;
    this.cashRegisterData = new CashRegisterData();
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
      this.cashRegisterData = new CashRegisterData();
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
