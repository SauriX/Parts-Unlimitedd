import { IReagentList } from "./reagent";
import { IOptions } from "./shared";
import { IStudyList } from "./study";
export interface IParameterList {
  id: string;
  clave: string;
  nombre: string;
  nombreCorto: string;
  area: string;
  departamento: string;
  activo: boolean;
  requerido: boolean;
  deltaCheck: boolean;
  mostrarFormato: boolean;
  unidades: number;
  unidadNombre: string;
  tipoValor: string;
  valorInicial: string;
  valorFinal: string;
  criticoMinimo: number;
  criticoMaximo: number;
  solicitudEstudioId: number;
  resultadoId: string;
  resultado: string;
  ultimoResultado?: string;
  ultimaSolicitud?: string;
  ultimoExpedienteId?: string;
  ultimaSolicitudId?: string;
  formula?: string;
  observacionesId?: string;
  editable: boolean;
  index?: number;
  tipoValores?: ItipoValorForm[];
}

export interface IParameterValueListDto {
  id: string;
  clave: string;
  nombre: string;
  nombreCorto: string;
  area: string;
  departamento: string;
  activo: boolean;
  requerido: boolean;
  deltaCheck: boolean;
  mostrarFormato: boolean;
  unidades: number;
  unidadNombre: string;
  tipoValor: string;
  valorInicial: number;
  valorFinal: number;
  solicitudEstudioId: number;
  tipoValores: ItipoValorForm[];
}

export interface IParameterForm {
  id: string;
  clave: string;
  nombre: string;
  nombreCorto: string;
  unidades: number;
  tipoValor: any;
  formula?: string;
  valorInicial: string;
  departamentoId: number;
  areaId: number;
  unidadSi: number;
  fcsi: string;
  activo: boolean;
  requerido: boolean;
  deltaCheck: boolean;
  mostrarFormato: boolean;
  valorCriticos: boolean;
  estudios: IStudyList[];
  FormatoImpresionId?: number;
  funciones?: string;
  parametros?: string;
  reactivos: IReagentList[];
}

export interface ItipoValorForm {
  id?: string;
  parametroId?: string;
  nombre?: string;
  valorInicial?: number;
  valorFinal?: number;
  valorInicialNumerico?: number;
  valorFinalNumerico?: number;
  rangoEdadInicial?: number;
  rangoEdadFinal?: number;
  hombreValorInicial?: number;
  hombreValorFinal?: number;
  mujerValorInicial?: number;
  mujerValorFinal?: number;
  criticoMinimo?: number;
  criticoMaximo?: number;
  hombreCriticoMinimo?: number;
  hombreCriticoMaximo?: number;
  mujerCriticoMinimo?: number;
  mujerCriticoMaximo?: number;
  medidaTiempoId?: number;
  opcion?: string | "";
  descripcionTexto?: string | "";
  descripcionParrafo?: string | "";
  primeraColumna?: string | "";
  segundaColumna?: string | "";
  terceraColumna?: string | "";
  cuartaColumna?: string | "";
  quintaColumna?: string | "";
}

export interface IReagentForm {
  id: string;
  reactivo: string[];
  seleccion: boolean;
}

export interface Itipovalor {
  values: ItipoValorForm[];
  idParameter: String;
}

export class ParameterFormValues implements IParameterForm {
  id = "";
  clave = "";
  nombre = "";
  nombreCorto = "";
  unidades = 0;
  tipoValor = "0";
  valorInicial = "";
  departamentoId = 0;
  areaId = 0;
  unidadSi = 0;
  fcsi = "";
  activo = true;
  requerido = false;
  deltaCheck = false;
  mostrarFormato = false;
  valorCriticos = false;
  estudios: IStudyList[] = [];
  reactivos: IReagentList[] = [];
  FormatoImpresionId = undefined;

  constructor(init?: IParameterForm) {
    Object.assign(this, init);
  }
}

export class tipoValorFormValues implements ItipoValorForm {
  id = "";
  parametroId = "";
  nombre = "";
  valorInicial = 0;
  valorFinal = 0;
  valorInicialNumerico = 0;
  valorFinalNumerico = 0;
  rangoEdadInicial = 0;
  rangoEdadFinal = 0;
  hombreValorInicial = 0;
  hombreValorFinal = 0;
  mujerValorInicial = 0;
  mujerValorFinal = 0;
  hombreCriticoMinimo = 0;
  hombreCriticoMaximo = 0;
  mujerCriticoMinimo = 0;
  mujerCriticoMaximo = 0;
  medidaTiempo = 0;
  opcion = "";
  descripcionTexto = "";
  descripcionParrafo = "";
  primeraColumna = "";
  segundaColumna = "";
  terceraColumna = "";
  cuartaColumna = "";
  quintaColumna = "";
  constructor(init?: ItipoValorForm) {
    Object.assign(this, init);
  }
}

export interface IObservations {
  id: number;
  observacion: string;
}
