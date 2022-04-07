import { makeAutoObservable } from "mobx";
import Catalog from "../api/catalog";
import { ICatalogForm, ICatalogList } from "../models/catalog";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class CatalogStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  catalogs: ICatalogList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearCatalogs = () => {
    this.catalogs = [];
  };

  access = async () => {
    try {
      const scopes = await Catalog.access();
      this.scopes = scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (catalogName: string, search: string) => {
    try {
      const catalogs = await Catalog.getAll(catalogName, search);
      this.catalogs = catalogs;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.catalogs = [];
    }
  };

  getById = async <Type extends ICatalogList>(catalogName: string, id: number): Promise<Type | undefined> => {
    try {
      const catalog = await Catalog.getById<Type>(catalogName, id);
      return catalog;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  create = async (catalogName: string, catalog: ICatalogForm) => {
    try {
      const newCatalog = await Catalog.create(catalogName, catalog);
      alerts.success(messages.created);
      this.catalogs.push(newCatalog);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (catalogName: string, catalog: ICatalogForm) => {
    try {
      const updatedCatalog = await Catalog.update(catalogName, catalog);
      alerts.success(messages.updated);
      const id = this.catalogs.findIndex((x) => x.id === catalog.id);
      if (id !== -1) {
        this.catalogs[id] = updatedCatalog;
      }
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
}
