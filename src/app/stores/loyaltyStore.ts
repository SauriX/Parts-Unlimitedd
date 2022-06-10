import { makeAutoObservable } from "mobx";
import Loyalty from "../api/loyalty";
import { ILoyaltyForm, ILoyaltyList } from "../models/loyalty";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class LoyaltyStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  loyaltys: ILoyaltyList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearLoyalty = () => {
    this.loyaltys = [];
  };

  access = async () => {
    try {
      const scopes = await Loyalty.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const Loyaltys = await Loyalty.getAll(search);
      this.loyaltys = Loyaltys;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.loyaltys = [];
    }
  };

  getById = async (id: string) => {
    try {
      const Loyaltys = await Loyalty.getById(id);
      return Loyaltys;
    } catch (error) {
      console.log(error);
      alerts.warning(getErrors(error));
    }
  };

  create = async (loyaltys: ILoyaltyForm) => {
    try {
      await Loyalty.create(loyaltys);
      //const newLoyalty = await Loyalty.create(loyaltys);
      alerts.success(messages.created);
      //this.loyaltys.push(newLoyalty);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (loyaltys: ILoyaltyForm) => {
    try {
      await Loyalty.update(loyaltys);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await Loyalty.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: string) => {
    try {
      await Loyalty.exportForm(id, "Formulario");
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  crearReagendado = async (loyaltys: ILoyaltyForm) => {
    try {
      await Loyalty.create(loyaltys);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
}