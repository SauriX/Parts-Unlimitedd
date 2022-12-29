import moment from "moment";

export interface IMassSearch {
  //formulario
  fechas: moment.Moment[];
  area: number;
  nombreArea: string;
  busqueda: string;
  estudios: string[];
  sucursales: string[];
}
export interface IParameter {
  nombre: string;
  unidades: string;
  etiqueta: string;
  valor?: string;
  selected?: boolean;
}

export interface IResult {
  id: string;
  clave: string;
  paciente: string;
  edad: string;
  genero: string;
  nombreEstudio: string;
  expedienteId: string;
  parameters: IParameter[];
}
export interface IResultList {
  results: IResult[];
  parameters: IParameter[];
}

export interface IDeliverResultsForm {
  clave?: string;
  companias: string[];
  departamentos: number[];
  fechaInicial: moment.Moment;
  fechaFinal: moment.Moment;
  medicos: string[];
  mediosEntrega: number[];
  procedencias: number[];
  estatus: number[];
  sucursales: string[];
  tipoFecha: number;
  tipoSolicitud: number[];
}

export class MassSearchValues implements IMassSearch {
  fechas = [moment(Date.now()).utcOffset(0, true), moment(Date.now()).utcOffset(0, true)];
  area = 0;
  nombreArea = "";
  busqueda = "";
  estudios = [];
  sucursales = [];

  constructor(init?: IMassSearch) {
    Object.assign(this, init);
  }
}
