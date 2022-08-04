import { IIndicationList } from "./indication";
import { IParameterList } from "./parameter";

export interface IRequestBase {
  solicitudId: string;
  expedienteId: string;
}

export interface IRequest extends Omit<IRequestBase, "solicitudId"> {
  solicitudId?: string;
  sucursalId: string;
  clave?: string;
  clavePatologica?: string;
  registro?: string;
  esNuevo: boolean;
}

export interface IRequestGeneral extends IRequestBase {
  procedencia?: number;
  compañiaId?: string;
  medicoId?: string;
  afiliacion: string;
  urgencia?: number;
  metodoEnvio?: string[];
  correo: string;
  whatsapp: string;
  observaciones: string;
}

export interface IRequestImage extends IRequestBase {
  imagen?: File | Blob;
  imagenUrl?: string;
  tipo: "orden" | "ine" | "formato";
}

export interface IRequestPartiality extends IRequestBase {
  aplicar: boolean;
}

export interface IRequestSend extends IRequestBase {
  correo?: string;
  telefono?: string;
}

export interface IRequestStudyUpdate extends IRequestBase {
  estudios: IRequestStudy[];
  paquetes?: IRequestPack[];
  totales?: IRequestTotal;
}

export class RequestStudyUpdate implements IRequestStudyUpdate {
  estudios: IRequestStudy[] = [];
  paquetes: IRequestPack[] = [];
  totales: IRequestTotal = new RequestTotal();
  solicitudId: string = "";
  expedienteId: string = "";

  constructor(init?: IRequestTotal) {
    Object.assign(this, init);
  }
}

export interface IRequestStudy {
  type: "study" | "pack";
  estudioId: number;
  clave: string;
  nombre: string;
  paqueteId?: number;
  paquete?: string;
  listaPrecioId: string;
  listaPrecio: string;
  promocionId?: number;
  promocion?: string;
  estatusId: number;
  aplicaDescuento: boolean;
  aplicaCargo: boolean;
  aplicaCopago: boolean;
  dias: number;
  horas: number;
  precio: number;
  descuento: number;
  precioFinal: number;
  parametros: IParameterList[];
  indicaciones: IIndicationList[];
}

export interface IRequestPack {
  type: "study" | "pack";
  paqueteId: number;
  clave: string;
  nombre: string;
  listaPrecioId: string;
  listaPrecio: string;
  promocionId?: number;
  promocion?: string;
  aplicaDescuento: boolean;
  aplicaCargo: boolean;
  aplicaCopago: boolean;
  dias: number;
  horas: number;
  precio: number;
  descuento: number;
  precioFinal: number;
  estudios: IRequestStudy[];
}

export interface IRequestTotal extends IRequestBase {
  totalEstudios: number;
  descuento: number;
  descuentoTipo: number;
  cargo: number;
  cargoTipo: number;
  copago: number;
  copagoTipo: number;
  total: number;
  saldo: number;
}

export class RequestTotal implements IRequestTotal {
  totalEstudios: number = 0;
  descuento: number = 0;
  descuentoTipo: number = 1;
  cargo: number = 0;
  cargoTipo: number = 1;
  copago: number = 0;
  copagoTipo: number = 1;
  total: number = 0;
  saldo: number = 0;
  solicitudId: string = "";
  expedienteId: string = "";

  constructor(init?: IRequestTotal) {
    Object.assign(this, init);
  }
}
