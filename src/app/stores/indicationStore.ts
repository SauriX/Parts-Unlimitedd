import Search from "antd/lib/transfer/search";
import { makeAutoObservable } from "mobx";
import { getParsedCommandLineOfConfigFile } from "typescript";
import Indication from "../api/indication";
import { IIndicationForm, IIndicationList } from "../models/indication";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class IndicationStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  indication: IIndicationList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearIndications = () => {
    this.indication = [];
  };

  access = async () => {
    try {
      const scopes = await Indication.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const indications = await Indication.getAll(search);
      this.indication = indications;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.indication = [];
    }
  };

  getById = async (id: number) => {
    try {
      const indication = await Indication.getById(id);
      return indication;
    } catch (error) {
      console.log(error);
      alerts.warning(getErrors(error));
    }
  };

  create = async (indication: IIndicationForm) => {
    try {
      await Indication.create(indication);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (indication: IIndicationForm) => {
    try {
      await Indication.update(indication);
      alerts.success(messages.updated);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
}