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
}

export interface IServicesCost {
  id?: number;
  costoFijo: number;
  nombre?: string;
  sucursal?: string;
  fechaAlta: moment.Moment;
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
}

export interface IModalIndicatorsFilter {
  sucursalId?: string[];
  fecha: moment.Moment[];
  servicios?: string[];
  ciudad?: string[];
}

export interface IServiceFile {
  archivo?: File | Blob;
}

export class IndicatorFilterValues implements IReportIndicatorsFilter {
  sucursalId = [];
  fechaInicial = moment(Date.now()).utcOffset(0, true);
  fechaFinal = moment(Date.now()).utcOffset(0, true);
  fechaIndividual = moment(Date.now()).utcOffset(0, true);

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
  fechaAlta = moment(Date.now()).utcOffset(0, true);
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
  fecha = [
    moment(Date.now()).utcOffset(0, true),
    moment(Date.now()).utcOffset(0, true),
  ];
  servicio = [];
  ciudad = [];

  constructor(init?: IModalIndicatorsFilter) {
    Object.assign(this, init);
  }
}
