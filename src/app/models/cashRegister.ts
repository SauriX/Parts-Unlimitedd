import moment from "moment";

export interface ICashRegisterData {
  porDia: IPerDayData[];
  canceladas: ICanceledPerDayData[];
  otroDia: IOtherDayData[];
}

export interface IPerDayData extends CommonData {}

export interface ICanceledPerDayData extends CommonData {}

export interface IOtherDayData extends CommonData {}

interface CommonData {
  id: string;
  solicitud: string;
  paciente: string;
  factura: string;
  aCuenta: number;
  efectivo: number;
  tdc: number;
  transferencia: number;
  cheque: number;
  tdd: number;
  pp: number;
  total: number;
  saldo: number;
  fecha: string;
  usuarioModifico: string;
  empresa: string;
}

export interface ICashRegisterFilter {
    sucursalId: string[];
    tipoCompañia: number[];
    fecha: moment.Moment;
    hora: moment.Moment[];
  }
  
  export class CashRegisterFilterValues implements ICashRegisterFilter {
    sucursalId = [];
    tipoCompañia = [];
    fecha = moment(Date.now());
    hora = [moment().hour(0), moment().hour(23)];
  
    constructor(init?: ICashRegisterFilter) {
      Object.assign(this, init);
    }
  }