import { makeAutoObservable } from "mobx";
import ResultValidation from "../api/resultrelase";
import { Irelacelist, ISearchRelase, searchrelase } from "../models/relaseresult";

import { IUpdate } from "../models/sampling";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";


export default class RelaseResultStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  studys: Irelacelist[] = [];
  studyCont:number=0;
  soliCont:number=0;
  search:ISearchRelase = new searchrelase();
  setSearch=(search:  ISearchRelase)=>{
    this.search = search;
  };
  exportList = async (search:  ISearchRelase) => {
    try {
      await ResultValidation.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
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

  getAll = async (search: ISearchRelase) => {
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
      await ResultValidation.getOrderPdf(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  viewTicket = async (recordId: any) => {
    try {
      console.log(recordId,"record");
      await ResultValidation.getresultPdf(recordId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
