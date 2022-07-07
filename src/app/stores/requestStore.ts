import { makeAutoObservable } from "mobx";
import Request from "../api/request";
import { IReagentForm, IReagentList } from "../models/reagent";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class RequestStore {
  constructor() {
    makeAutoObservable(this);
  }

  printTicket = async () => {
    try {
      await Request.printTicket();
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
