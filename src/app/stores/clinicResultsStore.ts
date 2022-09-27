import { makeAutoObservable } from "mobx";
import ClinicResults from "../api/clinicResults";

import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";
import moment from "moment";
import { ClinicResultsFormValues, IClinicResultForm, IClinicResultList, IClinicStudy } from "../models/clinicResults";

export default class ClinicResultsStores {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  data: IClinicResultList[] = [];
  studies: IClinicStudy[] = [];
  formValues: IClinicResultForm = new ClinicResultsFormValues();
  loadingStudies: boolean = false;
  clear: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.data = [];
  };

  setFormValues = (newFormValues: IClinicResultForm) => {
    this.formValues = newFormValues;
  };

  clearFilter = () => {
    const emptyFilter: IClinicResultForm = {
      sucursalId: [],
      medicoId: [],
      compañiaId: [],
      fecha: [
        moment(Date.now()).utcOffset(0, true),
        moment(Date.now()).utcOffset(0, true).add(1, "day"),
      ],
      buscar: "",
      procedencia: [],
      departamento: [],
      tipoSolicitud: [],
      area: [],
      estatus: [],
      estudio: [],
    };
    this.data = [];
    this.formValues = emptyFilter;
    this.clear = !this.clear;
  };

  access = async () => {
    try {
      const scopes = await ClinicResults.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: IClinicResultForm) => {
    try {
      this.loadingStudies = true;
      const study = await ClinicResults.getAll(search);
      this.data = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.data = [];
    } finally {
      this.loadingStudies = false;
    }
  };

  exportList = async (search: IClinicResultForm) => {
    try {
      await ClinicResults.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
