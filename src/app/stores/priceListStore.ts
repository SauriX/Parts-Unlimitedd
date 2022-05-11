import { makeAutoObservable } from "mobx";
import PriceList from "../api/priceList";
import { IPriceListForm, IPriceListList } from "../models/priceList";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class PriceListStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  priceLists: IPriceListList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearPriceList = () => {
    this.priceLists = [];
  };

  access = async () => {
    try {
      const scopes = await PriceList.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const priceLists = await PriceList.getAll(search);
      this.priceLists = priceLists;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.priceLists = [];
    }
  };

  getById = async (id: string) => {
    try {
      const priceList = await PriceList.getById(id);
      return priceList;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  create = async (priceList: IPriceListForm) => {
    try {
      const newPriceList = await PriceList.create(priceList);
      alerts.success(messages.created);
      this.priceLists.push(newPriceList);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (priceList: IPriceListForm) => {
    try {
      const updatedPriceList = await PriceList.update(priceList);
      alerts.success(messages.updated);
      const id = this.priceLists.findIndex((x) => x.id === priceList.id);
      if (id !== -1) {
        this.priceLists[id] = updatedPriceList;
      }
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await PriceList.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: string) => {
    try {
      await PriceList.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
