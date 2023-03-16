import moment from "moment";
import { IIndicationList } from "./indication";
import { IParameterList } from "./parameter";
import { IPriceListInfoPromo } from "./priceList";
import { IStudyTag } from "./study";

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
  paciente?: string;
  sucursalId: string;
  sucursal?: string;
  clave?: string;
  estatusId: number;
  clavePatologica?: string;
  parcialidad: boolean;
  registro?: string;
  esNuevo: boolean;
  procedencia?: number;
  urgencia?: number;
  folioWeeClinic?: string;
  esWeeClinic: boolean;
  tokenValidado: boolean;
  servicios?: string[];
  saldoPendiente?: boolean;
  serie?: string;
  serieNumero?: string;
  estudios?: IRequestStudyInfo[];
  destino?:string;
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
  ciudad?: string[];
  sucursales?: string[];
  compañias?: string[];
  medicos?: string[];
  expediente?: string;
}

export class RequestFilterForm implements IRequestFilter {
  tipoFecha = 1;
  fechas = [moment(), moment()];
  fechaInicial = moment().utcOffset(0, true);
  fechaFinal = moment().utcOffset(0, true);

  constructor(init?: IRequestFilter) {
    Object.assign(this, init);
  }
}

export interface IRequestInfo extends IRequestBase {
  clave: string;
  clavePatologica: string;
  sucursal: string;
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

  constructor(init?: IRequestStudyInfo) {
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
  correo?: string;
  correos?: string[];
  whatsapp?: string;
  whatsapps?: string[];
  observaciones: string;
  correoMedico?: string;
  telefonoMedico?: string;
  cambioCompañia?: boolean;
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
  facturaId?: string;
  serieFactura: string;
  facturapiId: string;
  usuarioRegistra?: string;
  fechaPago: moment.Moment;
  notificacionId?: string;
}

export interface IRequestCheckIn extends IRequestBase {
  datoFiscalId: string;
  serie: string;
  usoCFDI: string;
  formaPago: string;
  desglozado: boolean;
  simple: boolean;
  porConcepto: boolean;
  envioCorreo: boolean;
  envioWhatsapp: boolean;
  pagos: IRequestPayment[];
  detalle: IRequestCheckInDetail[];
}

export interface IRequestCheckInDetail {
  clave: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  descuento: number;
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
  paqueteId?: number;
  paquete?: string;
  listaPrecioId: string;
  listaPrecio: string;
  promocionId?: number;
  promocion?: string;
  estatusId: number;
  estatus?: string;
  departamentoId: number;
  areaId: number;
  dias: number;
  horas: number;
  fechaEntrega: moment.Moment;
  precio: number;
  descuento?: number;
  descuentoPorcentaje?: number;
  ordenEstudioId?: number;
  copago?: number;
  precioFinal: number;
  nuevo: boolean;
  asignado: boolean;
  promociones: IPriceListInfoPromo[];
  parametros: IParameterList[];
  indicaciones: IIndicationList[];
  etiquetas: IStudyTag[];
  fechaActualizacion?: string;
  usuarioActualizacion?: string;
  solicitudEstudioId?: number;
  nombreEstatus?: string;
  fechaTomaMuestra?: string;
  fechaValidacion?: string;
  fechaSolicitado?: string;
  fechaCaptura?: string;
  fechaLiberado?: string;
  fechaEnviado?: string;
  usuarioTomaMuestra?: string;
  usuarioValidacion?: string;
  usuarioSolicitado?: string;
  usuarioCaptura?: string;
  usuarioLiberado?: string;
  usuarioEnviado?: string;
  tipo?: string;
  destinoTipo: number;
  destinoId: string;
  destino: string;
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
  departamentoId = 0;
  areaId = 0;
  dias = 0;
  horas = 0;
  fechaEntrega = moment(moment.now());
  precio = 0;
  descuento = 0;
  descuentoPorcentaje = 0;
  copago = 0;
  precioFinal = 0;
  nuevo = false;
  asignado = true;
  parametros: IParameterList[] = [];
  indicaciones: IIndicationList[] = [];
  etiquetas: IStudyTag[] = [];
  promociones = [];
  fechaActualizacion = "";
  usuarioActualizacion = "";
  destinoTipo = 1;
  destinoId = "";
  destino = "";

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
  cancelado: boolean;
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
  asignado: boolean;
  promociones: IPriceListInfoPromo[];
  estudios: IRequestStudy[];
}

export interface IRequestTag {
  id: string | number;
  clave: string;
  destinoId: string;
  destino: string;
  destinoTipo: number;
  etiquetaId: number;
  claveEtiqueta: string;
  claveInicial: string;
  nombreEtiqueta: string;
  cantidad: number;
  color: string;
  observaciones?: string
  estudios: IRequestTagStudy[];
}

export interface IRequestTagStudy {
  id?: number;
  estudioId: number;
  nombreEstudio: string;
  orden: number;
  cantidad: number;
}

export interface IRequestTotal extends IRequestBase {
  totalEstudios: number;
  descuento: number;
  cargo: number;
  copago: number;
  total: number;
  saldo: number;
}

export class RequestTotal implements IRequestTotal {
  totalEstudios: number = 0;
  descuento: number = 0;
  cargo: number = 0;
  copago: number = 0;
  total: number = 0;
  saldo: number = 0;
  solicitudId: string = "";
  expedienteId: string = "";

  constructor(init?: IRequestTotal) {
    Object.assign(this, init);
  }
}

export interface IRequestToken extends IRequestBase {
  token?: string;
  reenviar: boolean;
}
