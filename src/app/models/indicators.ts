import moment from "moment";

export interface IReportIndicators {
  id: string;
  pacientes: number;
  ingresos: number;
  costoReactivo: number;
  costoTomaCalculado: number;
  fechaInicial: string;
  fechaFinal: string;
  fechaAlta: string;
  utilidadOperacion: string;
  sucursalId: string;
  sucursal: string;
  costoFijo: number;
}

export interface IModalInvoice {
  totalMensual: number;
  totalSemanal: number;
  totalDiario: number;
}

export interface IServicesCost {
  id: string;
  nombre: string;
  sucursal: string;
  fechaAlta: string;
}

export interface IReportIndicatorsFilter {
  sucursalId: string[];
  fechaInicial: moment.Moment;
  fechaFinal: moment.Moment;
  fechaIndividual: moment.Moment;
}

export interface IModalIndicatorsFilter {
  sucursalId: string[];
  fecha: moment.Moment[];
  servicio: string[];
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

export class ModalIndicatorFilterValues implements IModalIndicatorsFilter {
  sucursalId = [];
  fecha = [
    moment(Date.now()).utcOffset(0, true),
    moment(Date.now()).utcOffset(0, true),
  ];
  servicio = [];

  constructor(init?: IModalIndicatorsFilter) {
    Object.assign(this, init);
  }
}
