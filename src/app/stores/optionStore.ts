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

  clinicOptions: IOptions[] = [];

  getClinicOptions = async () => {
    try {
      const clinics = await Catalog.getActive<ICatalogNormalList>("clinic");
      console.log(clinics)
      this.clinicOptions = clinics.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.clinicOptions = [];
    }
  };

  filesOptions: IOptions[] = [];

  getfilesOptions = async () => {
    try {
      const files = await Catalog.getActive<ICatalogNormalList>("file");
      console.log(files)
      this.filesOptions = files.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.filesOptions = [];
    }
  };
}
