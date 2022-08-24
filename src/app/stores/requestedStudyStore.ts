import { makeAutoObservable } from "mobx";
import RequestedStudy from "../api/requestedStuy";
import {
  IRequestedStudyForm,
  IRequestedStudyList,
  IUpdate,
} from "../models/requestedStudy";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class RequestedStudyStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  data: IRequestedStudyList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.data = [];
  };

  access = async () => {
    try {
      const scopes = await RequestedStudy.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: IRequestedStudyForm) => {
    try {
      const study = await RequestedStudy.getAll(search);
      this.data = study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.data = [];
    }
  };

  update = async (study: IUpdate) => {
    try {
      await RequestedStudy.update(study);
      alerts.success(messages.updated);
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  printOrder = async (recordId: string, requestId: string) => {
    try {
      await RequestedStudy.getOrderPdf(recordId, requestId);
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
}
