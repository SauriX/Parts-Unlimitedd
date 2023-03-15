import moment from "moment";

export interface IPromotionList {
  id: number;
  clave: string;
  nombre: string;
  periodo: string;
  listaPrecio: string;
  activo: boolean;
}

export interface IPromotionStudyPack {
  estudioId?: number;
  paqueteId?: number;
  esEstudio: boolean;
  tipo: string;
  clave: string;
  nombre: string;
  departamentoId?: number;
  areaId?: number;
  area?: string;
  descuentoPorcentaje: number;
  descuentoCantidad: number;
  fechaInicial: Date;
  fechaFinal: Date;
  activo: boolean;
  precio: number;
  precioFinal: number;
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
  domingo: boolean;
}

export interface IPromotionDay {
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
  domingo: boolean;
}

export class PromotionDay implements IPromotionDay {
  lunes: boolean = false;
  martes: boolean = false;
  miercoles: boolean = false;
  jueves: boolean = false;
  viernes: boolean = false;
  sabado: boolean = false;
  domingo: boolean = false;

  constructor(init?: IPromotionForm) {
    Object.assign(this, init);
  }
}

export interface IPromotionForm {
  id: number;
  clave?: string;
  nombre?: string;
  tipoDescuento: "p" | "q";
  cantidad: number;
  aplicaMedicos: boolean;
  fechaInicial: Date;
  fechaFinal: Date;
  fechaDescuento: moment.Moment[];
  listaPrecioId?: string;
  activo: boolean;
  dias: IPromotionDay;
  sucursales: string[];
  medicos: string[];
  estudios: IPromotionStudyPack[];
}

export class PromotionFormValues implements IPromotionForm {
  id: number = 0;
  clave?: string | undefined;
  nombre?: string | undefined;
  tipoDescuento: "p" | "q" = "p";
  cantidad: number = 0;
  aplicaMedicos: boolean = false;
  fechaInicial = new Date();
  fechaFinal = new Date();
  fechaDescuento = [moment(), moment()];
  listaPrecioId?: string | undefined;
  activo: boolean = true;
  dias: IPromotionDay = new PromotionDay();
  sucursales: string[] = [];
  medicos: string[] = [];
  estudios: IPromotionStudyPack[] = [];

  constructor(init?: IPromotionForm) {
    Object.assign(this, init);
  }
}
