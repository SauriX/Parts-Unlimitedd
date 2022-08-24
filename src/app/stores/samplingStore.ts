import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import Sampling from "../api/sampling";
import { IsamplingForm, IsamplingList, IUpdate } from "../models/sampling";

export default class SamplingStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  studys: IsamplingList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.studys = [];
  };

  access = async () => {
    try {
      const scopes = await Sampling.access();
      this.scopes = scopes;
      console.log(scopes);
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: IsamplingForm) => {
    try {
      const study = await Sampling.getAll(search);
      this.studys = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.studys = [];
    }
  };

  update = async (study: IUpdate) => {
    try {
      await Sampling.update(study);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  printTicket = async (recordId: string, requestId: string) => {
    try {
      await Sampling.getOrderPdf(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
