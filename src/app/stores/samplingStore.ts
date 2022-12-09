import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import Sampling from "../api/sampling";
import {
  ISamplingForm,
  ISamplingList,
  IUpdate,
  SamplingFormValues,
} from "../models/sampling";
import { status } from "../util/catalogs";
import { IRequestedStudy } from "../models/requestedStudy";

export default class SamplingStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  data: ISamplingList[] = [];
  studies: IRequestedStudy[] = [];
  formValues: ISamplingForm = new SamplingFormValues();
  loadingStudies: boolean = false;

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.data = [];
  };

  setFormValues = (newFormValues: ISamplingForm) => {
    this.formValues = newFormValues;
  };

  

  access = async () => {
    try {
      const scopes = await Sampling.access();
      this.scopes = scopes;
      console.log(scopes);
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: ISamplingForm) => {
    try {
      this.loadingStudies = true;
      const study = await Sampling.getAll(search);
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
      await Sampling.update(study);
      alerts.success(messages.updated);

      this.data = this.data.map((x) => {
        x.estudios = x.estudios.map((z) => {
          const updated = study.find(
            (y) => y.solicitudId === x.id && y.estudioId.includes(z.id)
          );
          if (updated) {
            z.estatus =
              z.estatus === status.requestStudy.pendiente
                ? status.requestStudy.tomaDeMuestra
                : status.requestStudy.pendiente;
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
      await Sampling.getOrderPdf(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  
  exportList = async (search: ISamplingForm) => {
    try {
      await Sampling.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
