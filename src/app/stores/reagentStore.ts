import { makeAutoObservable } from "mobx";
import Reagent from "../api/reagent";
import { IReagentForm, IReagentList } from "../models/reagent";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class ReagentStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  reagents: IReagentList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearReagents = () => {
    this.reagents = [];
  };

  access = async () => {
    try {
      const scopes = await Reagent.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async () => {
    try {
      const reagents = await Reagent.getAll();
      this.reagents = reagents;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.reagents = [];
    }
  };

  getById = async (id: number) => {
    try {
      const reagent = await Reagent.getById(id);
      return reagent;
    } catch (error) {
      console.log(error);
      alerts.warning(getErrors(error));
    }
  };

  create = async (reagent: IReagentForm) => {
    try {
      await Reagent.create(reagent);
      alerts.success(messages.created);
      history.push("/reagent");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  update = async (reagent: IReagentForm) => {
    try {
      await Reagent.update(reagent);
      alerts.success(messages.updated);
      history.push("/reagent");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
}
