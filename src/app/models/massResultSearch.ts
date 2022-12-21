export interface IMassSearch {
  //formulario
  fechas: moment.Moment[];
  area: number;
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
