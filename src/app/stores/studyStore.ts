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

  
}