import moment from "moment";
import { IIndicationList } from "./indication";
import { IParameterList } from "./parameter";
import { IPriceListInfoPromo } from "./priceList";

export interface IQuotationBase {
  cotizacionId: string;
  expedienteId?: string;
}

export interface IQuotationFilter {
  fechaAlta?: moment.Moment[];
  fechaAInicial?: moment.Moment;
  fechaAFinal?: moment.Moment;
  ciudad?: string[];
  sucursales?: string[];
  correo?: string;
  telefono?: string;
  fechaNacimiento?: moment.Moment;
  fechaNInicial?: moment.Moment;
  fechaNFinal?: moment.Moment;
  expediente?: string;
}

export class QuotationFilterForm implements IQuotationFilter {
  fechaAlta = [
    moment(Date.now()).utcOffset(0, true),
    moment(Date.now()).utcOffset(0, true),
  ];
  fechaAInicial = moment().utcOffset(0, true);
  fechaAFinal = moment().utcOffset(0, true);
  ciudad = [];
  constructor(init?: IQuotationFilter) {
    Object.assign(this, init);
  }
}

export interface IQuotation extends Omit<IQuotationBase, "cotizacionId"> {
  cotizacionId: string;
  nombreMedico?: string;
  nombreCompania?: string;
  claveMedico?: string;
  observaciones?: string;
  sucursalId: string;
  clave?: string;
  registro?: string;
  estatusId: number;
  activo?: boolean;
}

export interface IQuotationInfo extends IQuotationBase {
  clave: string;
  expediente: string;
  paciente: string;
  correo: string;
  whatsapp: string;
  fecha: Date;
  activo: boolean;
  estudios: IQuotationStudyInfo[];
}

export interface IQuotationStudyInfo {
  id: number;
  estudioId: number;
  clave: string;
  nombre: string;
}

export class QuotationStudyInfoForm implements IQuotationStudyInfo {
  id = 0;
  estudioId = 0;
  clave = "";
  nombre = "";

  constructor(init?: IQuotationTotal) {
    Object.assign(this, init);
  }
}

export interface IQuotationGeneral extends IQuotationBase {
  procedencia: number;
  compañiaId?: string;
  medicoId?: string;
  metodoEnvio?: string[];
  correo?: string;
  correos?: string[];
  whatsapp?: string;
  whatsapps?: string[];
  observaciones: string;
  activo: boolean;
}

export interface IQuotationSend extends IQuotationBase {
  correo?: string;
  telefono?: string;
}

export interface IQuotationStudyUpdate extends IQuotationBase {
  estudios: IQuotationStudy[];
  paquetes?: IQuotationPack[];
  total?: IQuotationTotal;
}

export class QuotationStudyUpdate implements IQuotationStudyUpdate {
  estudios: IQuotationStudy[] = [];
  paquetes: IQuotationPack[] = [];
  total: IQuotationTotal = new QuotationTotal();
  cotizacionId: string = "";

  constructor(init?: IQuotationTotal) {
    Object.assign(this, init);
  }
}

export interface IQuotationStudy {
  type: "study" | "pack";
  id?: number;
  identificador?: string;
  estudioId: number;
  clave: string;
  nombre: string;
  paqueteId?: number;
  paquete?: string;
  listaPrecioId: string;
  listaPrecio: string;
  promocionId?: number;
  promocion?: string;
  aplicaCargo: boolean;
  dias: number;
  horas: number;
  precio: number;
  descuento?: number;
  descuentoPorcentaje?: number;
  precioFinal: number;
  promociones: IPriceListInfoPromo[];
  parametros: IParameterList[];
  indicaciones: IIndicationList[];
}
export class QuotationStudyValues implements IQuotationStudy {
  type: "study" | "pack" = "study";
  id = 0;
  estudioId = 0;
  clave = "";
  nombre = "";
  paqueteId = 0;
  paquete = "";
  listaPrecioId = "";
  listaPrecio = "";
  promocionId = 0;
  promocion = "";
  aplicaCargo = false;
  dias = 0;
  horas = 0;
  precio = 0;
  descuento = 0;
  descuentoPorcentaje = 0;
  precioFinal = 0;
  parametros: IParameterList[] = [];
  indicaciones: IIndicationList[] = [];
  promociones = [];

  constructor(init?: IQuotationStudy) {
    Object.assign(this, init);
  }
}

export interface IQuotationPack {
  type: "study" | "pack";
  id?: number;
  identificador?: string;
  paqueteId: number;
  clave: string;
  nombre: string;
  listaPrecioId: string;
  listaPrecio: string;
  promocionId?: number;
  promocion?: string;
  aplicaCargo: boolean;
  dias: number;
  horas: number;
  precio: number;
  descuento: number;
  descuentoPorcentaje: number;
  promocionDescuento?: number;
  promocionDescuentoPorcentaje?: number;
  precioFinal: number;
  promociones: IPriceListInfoPromo[];
  estudios: IQuotationStudy[];
}

export interface IQuotationTotal extends IQuotationBase {
  totalEstudios: number;
  descuento: number;
  total: number;
}

export class QuotationTotal implements IQuotationTotal {
  totalEstudios: number = 0;
  descuento: number = 0;
  total: number = 0;
  cotizacionId: string = "";

  constructor(init?: IQuotationTotal) {
    Object.assign(this, init);
  }
}
