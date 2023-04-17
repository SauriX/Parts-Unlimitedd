import moment from "moment";

export interface IReportIndicators {
  id?: string;
  pacientes?: number;
  ingresos?: number;
  costoReactivo: number;
  costoTomaCalculado?: number;
  fechaInicial?: string;
  fechaFinal?: string;
  fechaAlta: moment.Moment;
  utilidadOperacion?: string;
  sucursalId: string;
  sucursal?: string;
  costoFijo?: number;
}

export interface IListIndicators {
  id: string;
  costoReactivo: number;
  sucursalId: string;
  fechaAlta: string;
}

export interface IModalInvoice {
  key: string;
  totalMensual: number;
  totalSemanal: number;
  totalDiario: number;
}

export interface ISamplesCost {
  id?: string;
  costoToma: number;
  sucursal: string;
  sucursalId: string;
  fechaAlta: moment.Moment;
  aplica: string;
  fechaModificacion: moment.Moment;
  ciudad: string;
}

export interface IServicesCost {
  id?: string;
  costoFijoId?: number;
  identificador?: string;
  costoFijo: number;
  nombre?: string;
  sucursales?: IBranchService[];
  fechaAlta?: moment.Moment;
}

export interface IBranchService {
  costoId?: string;
  sucursalId: string;
  ciudad: string;
}

export interface IServicesInvoice {
  servicios?: IServicesCost[];
  totalMensual: number;
  totalSemanal: number;
  totalDiario: number;
}

export interface IReportIndicatorsFilter {
  sucursalId: string[];
  fechaInicial: moment.Moment;
  fechaFinal: moment.Moment;
  fechaIndividual: moment.Moment;
  tipoFecha: string;
}

export interface IModalIndicatorsFilter {
  sucursalId?: string[];
  fecha: moment.Moment[];
  mensual?: moment.Moment;
  servicios?: string[];
  ciudad?: string[];
}

export interface IUpdateService {
  servicios: IServicesCost[];
  filtros: IModalIndicatorsFilter;
}

export interface IServiceFile {
  archivo?: File | Blob;
}

export class ServicesCost implements IServicesCost {
  costoFijoId = 0;
  identificador = "";
  costoFijo = 0;
  nombre = "";
  sucursales = [];
  fechaAlta = moment();

  constructor(init?: IServicesCost) {
    Object.assign(this, init);
  }
}

export class IndicatorFilterValues implements IReportIndicatorsFilter {
  sucursalId = [];
  fechaInicial = moment();
  fechaFinal = moment();
  fechaIndividual = moment();
  tipoFecha = "date";

  constructor(init?: IReportIndicatorsFilter) {
    Object.assign(this, init);
  }
}

export class ServiceInvoice implements IServicesInvoice {
  servicios = [];
  totalMensual = 0;
  totalSemanal = 0;
  totalDiario = 0;

  constructor(init?: IServicesInvoice) {
    Object.assign(this, init);
  }
}

export class IndicatorsFormValues implements IReportIndicators {
  id = "";
  pacientes = 0;
  ingresos = 0;
  costoReactivo = 0;
  costoTomaCalculado = 0;
  fechaInicial = "";
  fechaFinal = "";
  fechaAlta = moment();
  utilidadOperacion = "";
  sucursalId = "";
  sucursal = "";
  costoFijo = 0;

  constructor(init?: IReportIndicators) {
    Object.assign(this, init);
  }
}

export class ModalIndicatorFilterValues implements IModalIndicatorsFilter {
  sucursalId = [];
  fecha = [moment(), moment()];
  mensual = moment();
  servicio = [];
  ciudad = [];

  constructor(init?: IModalIndicatorsFilter) {
    Object.assign(this, init);
  }
}
