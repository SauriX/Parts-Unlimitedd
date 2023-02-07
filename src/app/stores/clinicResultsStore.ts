import { makeAutoObservable, toJS } from "mobx";
import ClinicResults from "../api/clinicResults";
import { IOptions, IScopes } from "../models/shared";
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
  IPrintTypes,
} from "../models/clinicResults";
import Request from "../api/request";
import messages from "../util/messages";
import { v4 as uuidv4 } from "uuid";

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
  studiesSelectedToPrint: IPrintTypes[] = [];
  observationsSelected: IOptions[] = [];
  observationText: string = "";
  lastViewedCode?: string;

  printSelectedStudies = async (configuration: any) => {
    try {
      await ClinicResults.printSelectedStudies(configuration);
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  setObservationsSelected = (observationsSelected: IOptions[]) => {
    this.observationsSelected = observationsSelected;
  };

  setObservationsText = (observationText: string) => {
    this.observationText = observationText;
  };

  getObservationsSelected = () => {
    return this.observationsSelected;
  };

  getObservationsText = () => {
    return this.observationText;
  };

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearStudy = () => {
    this.data = [];
  };

  addSelectedStudy = (estudio: IPrintTypes) => {
    this.studiesSelectedToPrint.push(estudio);
  };

  clearSelectedStudies = () => {
    this.studiesSelectedToPrint = [];
  };

  removeSelectedStudy = (estudio: IPrintTypes) => {
    this.studiesSelectedToPrint = this.studiesSelectedToPrint.filter(
      (item) => item.id !== estudio.id
    );
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

  createResults = async (results: IClinicResultCaptureForm[]) => {
    try {
      await ClinicResults.createResults(results);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateResults = async (
    results: IClinicResultCaptureForm[],
    recordId: string,
    envioManual: boolean
  ) => {
    try {
      await ClinicResults.updateResults(results, envioManual);
      alerts.success(messages.updated);
      this.getStudies(recordId, results[0].solicitudId);
      const index = this.studies.findIndex(
        (x) => x.id === results[0].estudioId
      );
      if (index !== -1) {
        this.studies[index] = {
          ...this.studies[index],
          parametros: results,
        };
      }
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  cancelResults = async (id: number) => {
    try {
      this.studies = this.studies.map((x) => {
        if (x.id !== id) return x;
        else {
          return {
            ...x,
            parametros: x.parametros.map((p) => ({
              ...p,
              resultado: undefined,
            })),
          };
        }
      });
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

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

  updateResultPathological = async (result: FormData, envioManual: boolean) => {
    // updateResultPathological = async (result: IResultPathological) => {
    try {
      await ClinicResults.updateResultPathological(result, envioManual);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  sendResultFile = async (listResult: any) => {
    // updateResultPathological = async (result: IResultPathological) => {
    try {
      const success = await ClinicResults.sendResultFile(listResult);
      return success;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  updateStatusStudy = async (requestStudyId: number, status: number) => {
    // updateResultPathological = async (result: IResultPathological) => {
    try {
      await ClinicResults.updateStatusStudy(requestStudyId, status);
      console.log("update", { requestStudyId, status });
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

  exportGlucose = async (results: IClinicResultCaptureForm) => {
    try {
      await ClinicResults.exportGlucose(results);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getStudies = async (recordId: string, requestId: string) => {
    try {
      const params = await ClinicResults.getStudies(recordId, requestId);
      this.studies = params.estudios.map((x) => ({
        identificador: uuidv4(),
        id: x.estudioId,
        clave: x.clave,
        nombre: x.nombre,
        status: x.estatusId,
        solicitudEstudioId: x.id,
        parametros: x.parametros.map((y, i) => ({
          id: y.resultadoId,
          estudioId: x.estudioId,
          solicitudId: requestId,
          estatus: x.estatusId,
          resultado: y.resultado,
          formula: y.formula!,
          parametroId: y.id,
          nombre: y.nombre,
          valorInicial: y.valorInicial,
          valorFinal: y.valorFinal,
          unidades: y.unidades,
          unidadNombre: y.unidadNombre,
          tipoValorId: y.tipoValor,
          solicitudEstudioId: x.id!,
          tipoValores: y.tipoValores!,
          criticoMinimo: y.criticoMinimo,
          criticoMaximo: y.criticoMaximo,
          ultimoResultado: y.ultimoResultado,
          ultimaSolicitud: y.ultimaSolicitud,
          ultimaSolicitudId: y.ultimaSolicitudId,
          ultimoExpedienteId: y.ultimoExpedienteId,
          deltaCheck: y.deltaCheck,
          editable: y.editable,
          observacionesId: y.observacionesId,
          orden: y.index!,
          clave: y.clave,
          rango:
            y.criticoMinimo >= parseFloat(y.resultado) ||
            parseFloat(y.resultado) >= y.criticoMaximo,
        })),
      }));
      console.log("studies", toJS(this.studies));
      return params;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  changeParameterRange = (id: string, estudioId: number) => {
    console.log(id, estudioId);
    let studyIndex = this.studies.findIndex((x) => x.id === 1612);
    let study = this.studies[studyIndex];
    let parameterIndex = study.parametros.findIndex(
      (x) => x.id === "44d55b73-5396-4240-b2b5-2c0ba35dfe58"
    );
    this.studies[studyIndex].parametros[parameterIndex].rango =
      !this.studies[studyIndex].parametros[parameterIndex].rango;
  };

  printResults = async (recordId: string, requestId: string) => {
    try {
      await ClinicResults.printResults(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
