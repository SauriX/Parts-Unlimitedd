import { makeAutoObservable } from "mobx";
import Medics from "../api/medics";
import { ImedicsForm, IMedicsList } from "../models/medics";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class MdicsStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  medics: MedicsList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearMedicss = () => {
    this.medics = [];
  };

  access = async () => {
    try {
      const scopes = await Medics.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async () => {
    try {
      const medics = await Medics.getAll();
      this.medics = medics;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.medics = [];
    }
  };

  getById = async (id: number) => {
    try {
      const medics = await Medics.getById(id);
      return medics;
    } catch (error) {
      console.log(error);
      alerts.warning(getErrors(error));
    }
  };

  create = async (medics: IMedicsForm) => {
    try {
      await Medics.create(medics);
      alerts.success(messages.created);
      history.push("/medics");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  update = async (medics: IMedicsForm) => {
    try {
      await Medics.update(medics);
      alerts.success(messages.updated);
      history.push("/medics");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
}