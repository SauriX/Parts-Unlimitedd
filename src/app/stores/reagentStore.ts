import { makeAutoObservable } from "mobx";
import Reagent from "../api/reagent";
import { IReagentForm, IReagentList } from "../models/reagent";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
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
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const reagents = await Reagent.getAll(search);
      this.reagents = reagents;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.reagents = [];
    }
  };

  getById = async (id: number) => {
    try {
      const reagent = await Reagent.getById(id);
      return reagent;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  create = async (reagent: IReagentForm) => {
    try {
      await Reagent.create(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (reagent: IReagentForm) => {
    try {
      await Reagent.update(reagent);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await Reagent.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: number) => {
    try {
      await Reagent.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
