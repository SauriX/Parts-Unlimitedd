import moment from "moment";
import { ItipoValorForm } from "./parameter";

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
  tipoValores?: ItipoValorForm[];
}

export interface IClinicResultForm {
  sucursalId?: string[];
  medicoId?: string[];
  compañiaId?: string[];
  fecha?: moment.Moment[];
  buscar?: string;
  procedencia?: number[];
  departamento?: number[];
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
    moment(Date.now()).utcOffset(0, true),
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
  formula = "";
  unidades = 0;
  solicitudEstudioId = 0;
  unidadNombre = "";
  deltaCheck = false;
  orden = 0;
  clave = "";

  constructor(init?: IClinicResultForm) {
    Object.assign(this, init);
  }
}
