import moment from "moment";
import { ItipoValorForm } from "./parameter";

export interface IClinicResultList {
  id: string;
  identificador?: string;
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
  observacion: string;
  estudios: IClinicStudy[];
  procedencia: number;
  clavePatologica: string;
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
  fechaActualizacion?: string;
  usuarioActualizacion?: string;
  urgencia?: number;
  solicitudEstudioId?: number;
  parametros: IClinicResultCaptureForm[];
}

export interface IClinicResultCaptureForm {
  id?: string;
  nombre: string;
  solicitudId: string;
  estudioId: number;
  tipoValorId: string;
  valorInicial: string;
  valorFinal: string;
  criticoMinimo?: number;
  criticoMaximo?: number;
  parametroId: string;
  resultado?: string | string[];
  ultimoResultado?: string;
  ultimaSolicitud?: string;
  ultimoExpedienteId?: string;
  ultimaSolicitudId?: string;
  deltaCheck: boolean;
  unidades?: number;
  unidadNombre: string;
  solicitudEstudioId?: number;
  estatus: number;
  formula?: string;
  nombreCorto?: string;
  rango?: boolean;
  orden: number;
  editable?: boolean;
  clave: string;
  observacionesId?: string;
  tipoValores?: ItipoValorForm[];
}

export interface IGeneralForm {
  sucursalId?: string[];
  medicoId?: string[];
  compañiaId?: string[];
  fecha?: moment.Moment[];
  buscar?: string;
  procedencia?: number[];
  departamento?: string[];
  ciudad?: string[];
  area?: number[];
  tipoSolicitud?: string[];
  estatus?: number[];
  estudio?: number[];
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
  constructor(init?: IGeneralForm) {
    Object.assign(this, init);
  }
}

export class ClinicResultsFormValues implements IGeneralForm {
  sucursalId = [];
  medicoId = [];
  compañiaId = [];
  fecha = [
    moment(Date.now()).utcOffset(0, true),
    moment(Date.now()).utcOffset(0, true),
  ];
  buscar = "";
  procedencia = [];
  departamento = [];
  ciudad = [];
  tipoSolicitud = [];
  area = [];
  estatus = [];
  estudio = [];

  constructor(init?: IGeneralForm) {
    Object.assign(this, init);
  }
}

export class ClinicResultsCaptureForm implements IClinicResultCaptureForm {
  id = "";
  solicitudId = "";
  estudioId = 0;
  tipoValorId = "";
  estatus = 0;
  nombre = "";
  valorInicial = "";
  valorFinal = "";
  criticoMinimo = 0;
  criticoMaximo = 0;
  parametroId = "";
  resultado = "";
  ultimoResultado = "";
  ultimaSolicitud = "";
  ultimoExpedienteId = "";
  ultimaSolicitudId = "";
  observacionesId = "";
  formula = "";
  unidades = 0;
  solicitudEstudioId = 0;
  unidadNombre = "";
  deltaCheck = false;
  orden = 0;
  clave = "";

  constructor(init?: IGeneralForm) {
    Object.assign(this, init);
  }
}
