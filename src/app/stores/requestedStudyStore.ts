import { makeAutoObservable } from "mobx";
import RequestedStudy from "../api/requestedStudy";
import {
  IRequestedStudyForm,
  IRequestedStudyList,
  IRequestedStudy,
  IUpdate,
} from "../models/requestedStudy";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import { status } from "../util/catalogs";
import { IGeneralForm } from "../models/general";

export default class RequestedStudyStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  data: IRequestedStudyList[] = [];
  studies: IRequestedStudy[] = [];
  loadingStudies: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.data = [];
  };
  
  access = async () => {
    try {
      const scopes = await RequestedStudy.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: IGeneralForm) => {
    try {
      this.loadingStudies = true;
      const study = await RequestedStudy.getAll(search);
      this.data = study;
      return study;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.data = [];
    } finally {
      this.loadingStudies = false;
    }
  };

  update = async (study: IUpdate[]) => {
    try {
      await RequestedStudy.update(study);
      alerts.success(messages.updated);

      // const ids = study.estudioId;

      this.data = this.data.map((x) => {
        x.estudios = x.estudios.map((z) => {
          const updated = study.find(
            (y) => y.solicitudId === x.id && y.estudioId.includes(z.id)
          );
          if (updated) {
            z.estatus =
              z.estatus === status.requestStudy.tomaDeMuestra
                ? status.requestStudy.solicitado
                : status.requestStudy.tomaDeMuestra;
          }

          return z;
        });
        return x;
      });

      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  printOrder = async (recordId: string, requestId: string) => {
    try {
      await RequestedStudy.getOrderPdf(recordId, requestId);
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  exportList = async (search: IGeneralForm) => {
    try {
      await RequestedStudy.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
