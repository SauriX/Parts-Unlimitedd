import { makeAutoObservable } from "mobx";
import ResultValidation from "../api/resultvalidation";
import { ISearchValidation, Ivalidationlist } from "../models/resultValidation";
import { IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";


export default class ResultValidationStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  studys: Ivalidationlist[] = [];
  studyCont:number=0;
  soliCont:number=0;

  setStudyCont=(cont:number)=>{
    this.studyCont=cont;
  };
  setSoliCont=(cont:number)=>{
    this.soliCont=cont;
  };
  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.studys = [];
  };

  access = async () => {
    try {
      const scopes = await ResultValidation.access();
      this.scopes = scopes;
      console.log(scopes);
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: ISearchValidation) => {
    try {
      const study = await ResultValidation.getAll(search);
      this.studys = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.studys = [];
    }
  };

  update = async (study: IUpdate[]) => {
    try {
      console.log(study);
      await ResultValidation.update(study);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  printTicket = async (recordId: string, requestId: string) => {
    try {
      await ResultValidation.DownloadOrderPdf(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  viewTicket = async (recordId: string, requestId: string) => {
    try {
      await ResultValidation.getOrderPdf(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
