import moment from "moment";
import { IParameterList } from "./parameter";

export interface IClinicResultList {
  id: string;
  expedienteId: string;
  solicitud: string;
  nombre: string;
  order: string;
  registro: string;
  sucursal: string;
  sucursalNombre: string;
  nombreMedico: string;
  usuarioCreo: string;
  edad: string;
  sexo: string;
  compañia: string;
  seleccion: boolean;
  estudios: IClinicStudy[];
  procedencia: number;
}
export interface IResultPathological {
  id?: string;
  solicitudId: string;
  estudioId: number;
  requestStudyId: number;
  descripcionMacroscopica: string;
  descripcionMicroscopica: string;
  imagenPatologica?: any;
  diagnostico: string;
  muestraRecibida: string;
  medicoId: string;
  listaImagenesCargadas: string[];
  estatus: number;
  departamentoEstudio: string;
}

export interface IClinicStudy {
  id: number;
  nombre: string;
  area?: string;
  status: number;
  registro?: string;
  entrega?: string;
  nombreEstatus?: string;
  seleccion?: boolean;
  clave: string;
  parametros: IClinicResultCaptureForm[];
}

export interface IClinicResultCaptureForm {
  id?: string;
  nombre: string;
  solicitudId: string;
  estudioId: number;
  tipoValorId: string;
  valorInicial: number;
  valorFinal: number;
  parametroId: string;
  resultado?: string;
  unidades: number;
  unidadNombre: string;
  solicitudEstudioId?: number;
}

export interface IClinicResultForm {
  sucursalId: string[];
  medicoId: string[];
  compañiaId: string[];
  fecha: moment.Moment[];
  buscar: string;
  procedencia: number[];
  departamento: number[];
  area: number[];
  tipoSolicitud: string[];
  estatus: number[];
  estudio: number[];
}

export interface IStudyList {
  id: number;
  nombre: string;
  area: string;
  status: number;
  registro: string;
  entrega: string;
  seleccion: boolean;
  clave: string;
}

export interface IPrintTypes {
  id: number;
  tipo: string;
}

export class ResultPathologicalValues implements IResultPathological {
  id? = "";
  solicitudId = "";
  estudioId = 0;
  requestStudyId = 0;
  descripcionMacroscopica = "";
  descripcionMicroscopica = "";
  imagenPatologica? = "";
  diagnostico = "";
  muestraRecibida = "";
  medicoId = "";
  listaImagenesCargadas = [];
  estatus = 0;
  departamentoEstudio = "";
  constructor(init?: IClinicResultForm) {
    Object.assign(this, init);
  }
}

export class ClinicResultsFormValues implements IClinicResultForm {
  sucursalId = [];
  medicoId = [];
  compañiaId = [];
  fecha = [
    moment(Date.now()).utcOffset(0, true),
    moment(Date.now()).utcOffset(0, true).add(1, "day"),
  ];
  buscar = "";
  procedencia = [];
  departamento = [];
  tipoSolicitud = [];
  area = [];
  estatus = [];
  estudio = [];

  constructor(init?: IClinicResultForm) {
    Object.assign(this, init);
  }
}

export class ClinicResultsCaptureForm implements IClinicResultCaptureForm {
  id = "";
  solicitudId = "";
  estudioId = 0;
  tipoValorId = "0";
  nombre = "";
  valorInicial = 0;
  valorFinal = 0;
  parametroId = "";
  resultado = "";
  unidades = 0;
  solicitudEstudioId = 0;
  unidadNombre = "";

  constructor(init?: IClinicResultForm) {
    Object.assign(this, init);
  }
}
