import moment from "moment";

export interface ISamplingForm {
  fecha?: moment.Moment[];
  buscar?: string;
  procedencia?: number[];
  departamento?: number[];
  ciudad?: string[];
  tipoSolicitud?: string[];
  area?: number[];
  sucursal?: string[];
  status?: number[];
  medico?: string[];
  compañia?: string[];
}
export interface ISamplingList {
  id: string;
  solicitud: string;
  nombre: string;
  order: string;
  registro: string;
  expedienteId?: string;
  sucursal: string;
  edad: string;
  sexo: string;
  compañia: string;
  seleccion: boolean;
  observacion: string;
  estudios: IStudySampling[];
  clavePatologica: string;
  expediente:string;
}
export interface IStudySampling {
  id: number;
  solicitudEstudioId: number;
  nombre: string;
  area: string;
  estatus: number;
  expedienteId?: string;
  status: number;
  registro: string;
  entrega: string;
  seleccion: boolean;
  clave: string;
  solicitudId: string;
  nombreEstatus: string;
  fechaActualizacion: string;
  usuarioActualizacion: string;
  urgencia: number;
  observacion: string;
}
export interface IUpdate {
  solicitudId: string;
  estudioId: number[];
  observacion?: ISamplingComment[];
  ruteOrder?: string;
}

export interface ISamplingComment {
  id: number;
  observacion: string;
}

export class SamplingFormValues implements ISamplingForm {
  fecha = [moment(), moment()];
  buscar = "";
  procedencia = [];
  departamento = [];
  ciudad = [];
  tipoSolicitud = [];
  area = [];
  sucursal = [];
  status = [];
  medico = [];
  compañia = [];

  constructor(init?: ISamplingForm) {
    Object.assign(this, init);
  }
}
