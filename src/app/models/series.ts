import moment from "moment";

export interface ISeriesList {
  id: number;
  clave: string;
  descripcion: string;
  sucursal: string;
  tipoSerie: string;
  tipo: number;
  activo: boolean;
  cfdi: boolean;
  año: string;
  relacion: boolean;
}

export interface ITicketList {
  id: number;
  clave: string;
  tipoSerie: string;
  fecha: string;
}

export interface ISeries {
  id?: number;
  factura: ISeriesInvoice;
  expedicion: ISeriesExpedition;
}

export interface ITicketSerie {
  id: number;
  clave: string;
  nombre: string;
  tipoSerie: number;
  expedicion: ISeriesExpedition;
}

export interface ISeriesInvoice {
  id: number;
  clave: string;
  nombre: string;
  observaciones: string;
  tipoSerie: number;
  estatus: boolean;
  cfdi: boolean;
  archivoCer?: File;
  archivoKey?: File;
  claveCer?: string;
  claveKey?: string;
  contraseña: string;
  año: moment.Moment;
}

export interface ISeriesOwner {
  id: number;
  nombre: string;
  rfc: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  pais: string;
  correo: string;
  telefono: string;
  website: string;
}

export interface ISeriesExpedition {
  id: number;
  sucursalKey: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  colonia: string;
  codigoPostal: string;
  municipio: string;
  estado: string;
  pais: string;
  telefono: string;
  correo: string;
  sucursalId?: string;
}

export interface ISeriesFilter {
  año: moment.Moment;
  tipoSeries?: number[];
  buscar?: string;
  sucursalId?: string[];
  ciudad?: string[];
}

export interface ISeriesNewForm {
  sucursalId: string;
  tipoSerie: number;
  emisorId?: string;
  usuarioId?: string;
}

export class SeriesFilterValues implements ISeriesFilter {
  sucursalId = [];
  ciudad = [];
  año = moment();
  tipoSeries = [];
  buscar = "";

  constructor(init?: ISeriesFilter) {
    Object.assign(this, init);
  }
}

export class SeriesNewFormValues implements ISeriesNewForm {
  sucursalId = "";
  tipoSerie = 0;
  emisorId = "";
  usuarioId = "";

  constructor(init?: ISeriesNewForm) {
    Object.assign(this, init);
  }
}

export class SeriesValues implements ISeries {
  id = 0;
  factura = new SeriesInvoiceValues();
  expedicion = new SeriesExpeditionValues();

  constructor(init?: ISeries) {
    Object.assign(this, init);
  }
}

export class SeriesInvoiceValues implements ISeriesInvoice {
  id = 0;
  clave = "";
  nombre = "";
  observaciones = "";
  tipoSerie = 1;
  estatus = false;
  cfdi = false;
  claveCer = "";
  claveKey = "";
  contraseña = "";
  año = moment();

  constructor(init?: ISeriesInvoice) {
    Object.assign(this, init);
  }
}

export class SeriesExpeditionValues implements ISeriesExpedition {
  id = 0;
  sucursalKey = "";
  calle = "";
  numeroExterior = "";
  numeroInterior = "";
  colonia = "";
  codigoPostal = "";
  municipio = "";
  estado = "";
  pais = "";
  telefono = "";
  correo = "";
  sucursalId = "";

  constructor(init?: ISeriesExpedition) {
    Object.assign(this, init);
  }
}

export class TicketSeriesValues implements ITicketSerie {
  id = 0;
  clave = "";
  nombre = "";
  tipoSerie = 2;
  expedicion = new SeriesExpeditionValues();

  constructor(init?: ITicketSerie) {
    Object.assign(this, init);
  }
}
