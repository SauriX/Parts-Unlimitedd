import Search from "antd/lib/transfer/search";
import { makeAutoObservable } from "mobx";
import { getParsedCommandLineOfConfigFile } from "typescript";
import Study from "../api/study";
import { IStudyForm, IStudyList } from "../models/study";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class StudyStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  study: IStudyList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.study = [];
  };

  access = async () => {
    try {
      const scopes = await Study.access();
      this.scopes = scopes;
      console.log(scopes);
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const study = await Study.getAll(search);
      this.study = study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.study = [];
    }
  };

  getById = async (id: number) => {
    try {
      const study = await Study.getById(id);
      return study;
    } catch (error) {
      console.log(error);
      alerts.warning(getErrors(error));
    }
  };

  create = async (study: IStudyForm) => {
    try {
        console.log("here");
      await Study.create(study);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
   update = async (study: IStudyForm) => {
    try {
      await Study.update(study);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  exportList = async (search: string) => {
    try {
      await Study.exportList(search);
      return true
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (id: number,clave?:string) => {
    try {
      await Study.exportForm(id,clave);
      return true;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}