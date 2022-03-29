import Search from "antd/lib/transfer/search";
import { makeAutoObservable } from "mobx";
import Medics from "../api/medics";
import { IMedicsForm, IMedicsList } from "../models/medics";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class MedicsStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  medics: IMedicsList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearMedics = () => {
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

  getAll = async (search: string) => {
    try {
      const medics = await Medics.getAll(search);
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
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (medics: IMedicsForm) => {
    try {
      await Medics.update(medics);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
}