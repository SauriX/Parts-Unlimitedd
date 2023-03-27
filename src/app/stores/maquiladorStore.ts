import { makeAutoObservable } from "mobx";
import Maquilador from "../api/maquilador";
import { IMaquiladorForm, IMaquiladorList } from "../models/maquilador";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class MaquiladorStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  maquilador: IMaquiladorList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearMaquilador = () => {
    this.maquilador = [];
  };

  access = async () => {
    try {
      const scopes = await Maquilador.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const maquilador = await Maquilador.getAll(search);
      this.maquilador = maquilador;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.maquilador = [];
    }
  };

  getById = async (id: number) => {
    try {
      const maquilador = await Maquilador.getById(id);
      return maquilador;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  create = async (maquilador: IMaquiladorForm) => {
    try {
      await Maquilador.create(maquilador);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (maquilador: IMaquiladorForm) => {
    try {
      await Maquilador.update(maquilador);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await Maquilador.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: number) => {
    try {
      await Maquilador.exportForm(id, "Formulario");
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}