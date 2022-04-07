import { makeAutoObservable } from "mobx";
import Catalog from "../api/catalog";
import { ICatalogNormalList } from "../models/catalog";
import { IOptions, IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class OptionStore {
  constructor() {
    makeAutoObservable(this);
  }

  departmentOptions: IOptions[] = [];

  getDepartmentOptions = async () => {
    try {
      const departments = await Catalog.getActive<ICatalogNormalList>("department");
      this.departmentOptions = departments.map((x) => ({ value: x.id, label: x.clave }));
    } catch (error) {
      this.departmentOptions = [];
    }
  };
}
