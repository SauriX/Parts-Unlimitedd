import moment from "moment";

export interface IMassSearch {
  //formulario
  reuqestStudyId?: string;
  fechas: moment.Moment[];
  area?: number;
  nombreArea?: string;
  busqueda?: string;
  estudios?: string[];
  sucursales?: string[];
}
export interface IParameter {
  id?: string;
  clave?: string;
  tipoValorId?: string;
  nombre: string;
  unidades: string;
  etiqueta: string;
  valor?: string;
  selected?: boolean;
}

export interface IResult {
  id: string;
  reuqestStudyId?: string;
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
  fechas = [moment(), moment()];
  area = 0;
  nombreArea = "";
  busqueda = "";
  estudios = [];
  sucursales = [];

  constructor(init?: IMassSearch) {
    Object.assign(this, init);
  }
}
