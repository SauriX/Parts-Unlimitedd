import { makeAutoObservable } from "mobx";
import ClinicResults from "../api/clinicResults";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";
import moment from "moment";
import {
  ClinicResultsFormValues,
  IClinicResultCaptureForm,
  IClinicResultForm,
  IClinicResultList,
  IClinicStudy,
} from "../models/clinicResults";
import Request from "../api/request";

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

  createResults = async(results: IClinicResultCaptureForm[]) => {
    try {
      await ClinicResults.createResults(results);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  }

  updateResults = async(results: IClinicResultCaptureForm[]) => {
    try {
      await ClinicResults.updateResults(results);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  }

  createResultPathological = async (result: FormData) => {
    // createResultPathological = async (result: IResultPathological) => {
    try {
      await ClinicResults.createResultPathological(result);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  getResultPathological = async (result: number) => {
    try {
      const resultPathological = await ClinicResults.getResultPathological(
        result
      );
      return resultPathological;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  updateResultPathological = async (result: FormData) => {
    // updateResultPathological = async (result: IResultPathological) => {
    try {
      await ClinicResults.updateResultPathological(result);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  updateStatusStudy = async (requestStudyId: number, status: number) => {
    // updateResultPathological = async (result: IResultPathological) => {
    try {
      await ClinicResults.updateStatusStudy(requestStudyId, status);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  getRequestStudyById = async (requestStudyId: number) => {
    try {
      const requestStudy = await ClinicResults.getRequestStudyById(
        requestStudyId
      );
      return requestStudy;
    } catch (error: any) {
      alerts.warning(getErrors(error));
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

  getStudies = async (recordId: string, requestId: string) => {
    try {
      const params = await ClinicResults.getStudies(recordId, requestId);
      this.studies = params.map(x => ({
        id: x.estudioId,
        clave: x.clave,
        nombre: x.nombre,
        status: x.estatusId,
        parametros: x.parametros.map(y => ({
          estudioId: x.estudioId,
          solicitudId: requestId,
          parametroId: y.id,
          nombre: y.nombre,
          valorInicial: y.valorInicial,
          valorFinal: y.valorFinal,
          unidades: y.unidades,
          tipoValorId: y.tipoValor,
        }))
      }));
      return params;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  printResults = async (recordId: string, requestId: string) => {
    try {
      await Request.printTicket(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
