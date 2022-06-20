import { makeAutoObservable } from "mobx";
import Configuration from "../api/configuration";
import { IConfigurationEmail, IConfigurationFiscal, IConfigurationGeneral } from "../models/configuration";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import history from "../util/history";

export default class ConfigurationStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;

  clearScopes = () => {
    this.scopes = undefined;
  };

  access = async () => {
    try {
      const scopes = await Configuration.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getEmail = async () => {
    try {
      const email = await Configuration.getEmail();
      return email;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getGeneral = async () => {
    try {
      const general = await Configuration.getGeneral();
      return general;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getFiscal = async () => {
    try {
      const fiscal = await Configuration.getFiscal();
      return fiscal;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  updateEmail = async (configuration: IConfigurationEmail) => {
    try {
      await Configuration.updateEmail(configuration);
      alerts.success(messages.updated);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  updateGeneral = async (configuration: FormData) => {
    try {
      await Configuration.updateGeneral(configuration);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateFiscal = async (configuration: IConfigurationFiscal) => {
    try {
      await Configuration.updateFiscal(configuration);
      alerts.success(messages.updated);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
