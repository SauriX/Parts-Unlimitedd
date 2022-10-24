import { makeAutoObservable } from "mobx";
import Request from "../api/request";
import WorkList from "../api/workList";
import { IWorkListFilter, WorkListFilterFormValues } from "../models/workList";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class WorkListStore {
  constructor() {
    makeAutoObservable(this);
  }

  filter: IWorkListFilter = new WorkListFilterFormValues();

  setFilter = (filter: IWorkListFilter) => {
    this.filter = filter;
  };

  getWorkListPdfUrl = async (filter: IWorkListFilter) => {
    try {
      const url = await WorkList.getWorkListPdfUrl(filter);
      return url;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
