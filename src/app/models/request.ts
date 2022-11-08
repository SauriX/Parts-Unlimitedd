import moment from "moment";
import { IIndicationList } from "./indication";
import { IParameterList } from "./parameter";
import { IPriceListInfoPromo } from "./priceList";

export interface IRequestBase {
  solicitudId: string;
  expedienteId: string;
}

export interface IRequest extends Omit<IRequestBase, "solicitudId"> {
  solicitudId?: string;
  nombreMedico?: string;
  claveMedico?: string;
  nombreCompania?: string;
  observaciones?: string;
  sucursalId: string;
  clave?: string;
  estatusId: number;
  clavePatologica?: string;
  parcialidad: boolean;
  registro?: string;
  esNuevo: boolean;
  folioWeeClinic?: string;
  esWeeClinic: boolean;
  tokenValidado: boolean;
  servicios?: string[];
  estudios?: IRequestStudyInfo[];
}

export interface IRequestFilter {
  tipoFecha?: number;
  fechas?: moment.Moment[];
  fechaInicial?: moment.Moment;
  fechaFinal?: moment.Moment;
  clave?: string;
  procedencias?: number[];
  estatus?: number[];
  urgencias?: number[];
  departamentos?: number[];
  sucursales?: string[];
  compañias?: string[];
  medicos?: string[];
}

export interface IRequestInfo extends IRequestBase {
  clave: string;
  clavePatologica: string;
  afiliacion: string;
  paciente: string;
  compañia: string;
  procedencia: string;
  factura: string;
  importe: number;
  descuento: number;
  total: number;
  saldo: number;
  folioWeeClinic?: string;
  esWeeClinic: boolean;
  estudios: IRequestStudyInfo[];
}

export interface IRequestStudyInfo {
  id: number;
  estudioId: number;
  clave: string;
  nombre: string;
  estatusId: number;
  estatus: string;
  color: string;
  fechaTomaMuestra: string;
  fechaValidacion: string;
  fechaSolicitado: string;
  fechaCaptura: string;
  fechaLiberado: string;
  fechaEnviado: string;
  usuarioTomaMuestra: string;
  usuarioValidacion: string;
  usuarioSolicitado: string;
  usuarioCaptura: string;
  usuarioLiberado: string;
  usuarioEnviado: string;
}

export class RequestStudyInfoForm implements IRequestStudyInfo {
  id = 0;
  estudioId = 0;
  clave = "";
  nombre = "";
  estatusId = 0;
  estatus = "";
  color = "";
  fechaTomaMuestra = "";
  fechaValidacion = "";
  fechaSolicitado = "";
  fechaCaptura = "";
  fechaLiberado = "";
  fechaEnviado = "";
  usuarioTomaMuestra = "";
  usuarioValidacion = "";
  usuarioSolicitado = "";
  usuarioCaptura = "";
  usuarioLiberado = "";
  usuarioEnviado = "";

  constructor(init?: IRequestTotal) {
    Object.assign(this, init);
  }
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

export interface IRequestPayment extends IRequestBase {
  id: string;
  formaPagoId: number;
  formaPago: string;
  numeroCuenta: string;
  cantidad: number;
  serie: string;
  numero: string;
  estatusId: number;
  usuarioRegistra: string;
  fechaPago: moment.Moment;
}

export interface IRequestImage extends IRequestBase {
  imagen?: File | Blob;
  imagenUrl?: string;
  tipo: "orden" | "ine" | "ineReverso" | "formato";
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
  total?: IRequestTotal;
}

export class RequestStudyUpdate implements IRequestStudyUpdate {
  estudios: IRequestStudy[] = [];
  paquetes: IRequestPack[] = [];
  total: IRequestTotal = new RequestTotal();
  solicitudId: string = "";
  expedienteId: string = "";

  constructor(init?: IRequestTotal) {
    Object.assign(this, init);
  }
}

export interface IRequestStudy {
  type: "study" | "pack";
  id?: number;
  identificador?: string;
  estudioId: number;
  clave: string;
  nombre: string;
  taponId: number;
  taponColor: string;
  taponClave: string;
  taponNombre: string;
  paqueteId?: number;
  paquete?: string;
  listaPrecioId: string;
  listaPrecio: string;
  promocionId?: number;
  promocion?: string;
  estatusId: number;
  estatus?: string;
  aplicaDescuento: boolean;
  aplicaCargo: boolean;
  aplicaCopago: boolean;
  departamentoId: number;
  areaId: number;
  dias: number;
  horas: number;
  fechaEntrega: moment.Moment;
  precio: number;
  descuento?: number;
  descuentoPorcentaje?: number;
  precioFinal: number;
  nuevo: boolean;
  promociones: IPriceListInfoPromo[];
  parametros: IParameterList[];
  indicaciones: IIndicationList[];
  fechaActualizacion?: string;
  solicitudEstudioId?: number;
  nombreEstatus?: string;
}
export class RequestStudyValues implements IRequestStudy {
  type: "study" | "pack" = "study";
  id = 0;
  estudioId = 0;
  clave = "";
  nombre = "";
  taponId = 0;
  taponColor = "";
  taponClave = "";
  taponNombre = "";
  paqueteId = 0;
  paquete = "";
  listaPrecioId = "";
  listaPrecio = "";
  promocionId = 0;
  promocion = "";
  estatusId = 0;
  estatus = "";
  aplicaDescuento = false;
  aplicaCargo = false;
  aplicaCopago = false;
  departamentoId = 0;
  areaId = 0;
  dias = 0;
  horas = 0;
  fechaEntrega = moment(moment.now());
  precio = 0;
  descuento = 0;
  descuentoPorcentaje = 0;
  precioFinal = 0;
  nuevo = false;
  parametros: IParameterList[] = [];
  indicaciones: IIndicationList[] = [];
  promociones = [];
  fechaActualizacion = "";
  constructor(init?: IRequestStudy) {
    Object.assign(this, init);
  }
}
export interface IRequestPack {
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
  aplicaDescuento: boolean;
  aplicaCargo: boolean;
  aplicaCopago: boolean;
  departamentoId: number;
  areaId: number;
  dias: number;
  horas: number;
  precio: number;
  descuento: number;
  descuentoPorcentaje: number;
  promocionDescuento?: number;
  promocionDescuentoPorcentaje?: number;
  precioFinal: number;
  nuevo: boolean;
  promociones: IPriceListInfoPromo[];
  estudios: IRequestStudy[];
}

export interface IRequestTag {
  taponClave: string;
  taponNombre: string;
  estudios: string;
  cantidad: number;
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
