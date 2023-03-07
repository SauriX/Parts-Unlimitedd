import { regimenFiscal } from "./../util/catalogs";
import moment from "moment";

export interface IInvoiceFilter {
  fechas: moment.Moment[];
  sucursalId: string[];
  tipoFactura: string[];
  fechaFinal: string;
  fechaInicial: string;
  facturaMetodo: "request";
}

export interface IRequestsInvoices {
  solicitudes: IRequestsData[];
  total: number;
  totalC: number;
  totalD: number;
  totalEstudios: number;
  totalPrecio: number;
  totalSolicitudes: number;
}

export interface IRequestsData {
  cargo: number;
  clave: string;
  clavePatologico: string;
  compania: string;
  companiaId: string;
  descuento: number;
  estudios: IStudiesData[];
  expedienteId: string;
  facturas: IInvoicesData[];
  formasPagos: string[];
  monto: number;
  nombre: string;
  nombreSucursal: string;
  numerosCuentas: string[];
  rfc: string;
  saldo: number;
  solicitudId: string;
}

export interface IStudiesData {
  area: number;
  clave: string;
  claveSolicitud: string;
  descuento: number;
  descuentoPorcentaje: number;
  estudio: string;
  precio: number;
  precioFinal: number;
  solicitudEstudioId: number;
  solicitudId: string;
}

export interface IInvoicesData {
  estatus: IEstatus[];
  facturaId: string;
  facturapiId: string;
  fechaCreo: string;
  solicitudesId: string[];
  tipo: "request" | "company";
}

export interface IEstatus {
  clave: string;
  nombre: string;
}

export interface IInvoiceData {
  id: string;
  companyId: string;
  estatus: string;
  solicitudesId: string[];
  tipoFactura: string;
  taxDataId: string;
  compañiaId: string;
  expedienteId: string;
  facturaId: string;
  formaPago: string;
  numeroCuenta: string;
  serie: string;
  usoCFDI: string;
  tipoDesgloce: string;
  cantidadTotal: number;
  subtotal: number;
  iva: number;
  consecutivo: number;
  nombre: string;
  facturapiId: string;
  metodoPago: string;
  regimenFiscal: string;
  RFC: string;
  cliente: ICliente;
  detalles: IInvoiceDetail[];
}

export interface ICliente {
  razonSocial: string;
  RFC: string;
  regimenFiscal: string;
  direccionFiscal: string;
  correo: string;
  telefono: string;
  codigoPostal: string;
  calle: string;
  numeroExterior: string;
  colonia: string;
  ciudad: string;
  municipio: string;
  estado: string;
  pais: string;
}
export interface IInvoiceDetail {
  solicitudClave?: string;
  claveSolicitud?: string;
  estudioClave: string;
  concepto: string;
  cantidad: number;
  importe: number;
  descuento: number;
}

export interface IInvoiceInfo {
  id: string;
  estatus: string;
  facturapiId: string;
  compañiaId: string;
  tipoFactura: string;
  taxDataId: string;
  expedienteId: string;
  formaPago: string;
  numeroCuenta: string;
  serie: string;
  usoCFDI: string;
  tipoDesgloce: string;
  cantidadTotal: number;
  subtotal: number;
  IVA: number;
  consecutivo: string;
  nombre: string;
  facturaId: string;
  detalles: IInvoiceDetailInfo[];
}

export interface IInvoiceDetailInfo {
  solicitudClave: string;
  estudioClave: string;
  concepto: string;
  cantidad: number;
  importe: number;
  descuento: number;
}

export interface IMotivo {
  facturapiId: string;
  motivo: "01" | "02" | "03" | "04";
}
export interface IInvoiceDeliveryInfo {
  contactos: IContact[] | any[];
  mediosEnvio: string[];
  facturapiId: string;
  usuarioId?: string;
  esPrueba: boolean;
}
export interface IContact {
  nombre: string;
  correo: string;
  telefono: string;
}

export interface IReceiptData {
  sucursal: string;
  folio: string;
  atiende: string;
  usuario: string;
  Contraseña: string;
  ContactoTelefono: string;
  SolicitudesId: string[];
}
//////////////////////////////////////////////////////////////////////// INVOICES FREE 🤑🥵
export interface IInvoicesFreeFilter {
  buscar: string;
  compania: string;
  sucursal: string;
  estatus: string[];
  fechaInicial: moment.Moment;
  fechaFinal: moment.Moment;
  fechas: moment.Moment[];
  tipo: string[];
}
