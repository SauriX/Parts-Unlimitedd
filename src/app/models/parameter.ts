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
}

export interface IParameterForm {
  id: string;
  clave: string;
  nombre: string;
  nombreCorto: string;
  unidades: string;
  tipoValor: any;
  formula: string;
  formato: string;
  valorInicial: string;
  departamentoId: number;
  areaId: number;
  reactivoId: number;
  unidadSi: string;
  fcsi: string;
  activo: boolean;
  estudios: IStudyList[];
  FormatoImpresionId?: number;
  funciones?: string;
  parametros?: string;
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
  medidaTiempo?: number;
  opcion?: string | "";
  descripcionTexto?: string | "";
  descripcionParrafo?: string | "";
}

export class ParameterFormValues implements IParameterForm {
  id = "";
  clave = "";
  nombre = "";
  nombreCorto = "";
  unidades = "";
  tipoValor = 0;
  formula = "";
  formato = "";
  valorInicial = "";
  departamentoId = 0;
  areaId = 0;
  reactivoId = 0;
  unidadSi = "";
  fcsi = "";
  activo = false;
  estudios: IStudyList[] = [];
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
  medidaTiempo = 0;
  opcion = "";
  descripcionTexto = "";
  descripcionParrafo = "";
  constructor(init?: ItipoValorForm) {
    Object.assign(this, init);
  }
}
