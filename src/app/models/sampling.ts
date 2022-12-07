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
  estudios: IStudySampling[];
}
export interface IStudySampling {
  id: number;
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
}
export interface IUpdate {
  solicitudId: string;
  estudioId: number[];
}
export class SamplingFormValues implements ISamplingForm {
  fecha = [moment(moment.now()), moment(moment.now())];
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
