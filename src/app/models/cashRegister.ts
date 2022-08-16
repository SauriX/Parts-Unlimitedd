import moment from "moment";

export interface ICashRegisterData {
  perDay: ICommonData[];
  canceled: ICommonData[];
  otherDay: ICommonData[];
  cashTotal: Invoice;
}

export interface ICommonData {
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
  fecha: Date;
  usuarioModifico: string;
  empresa: string;
}

export interface Invoice {
  sumaEfectivo: number;
  sumaTDC: number;
  sumaTransferencia: number;
  sumaCheque: number;
  sumaTDD: number;
  total: number;
}

export interface ICashRegisterFilter {
  sucursalId: string[];
  tipoCompañia: number[];
  fechaIndividual: moment.Moment;
  hora: moment.Moment[];
}

export class CashRegisterFilterValues implements ICashRegisterFilter {
  sucursalId = [];
  tipoCompañia = [];
  fechaIndividual = moment(Date.now());
  hora = [
    moment().hour(7).minutes(0).utcOffset(0, true),
    moment().hour(19).minutes(0).utcOffset(0, true),
  ];

  constructor(init?: ICashRegisterFilter) {
    Object.assign(this, init);
  }
}

export class CashRegisterData implements ICashRegisterData {
  perDay = [];
  canceled = [];
  otherDay = [];
  cashTotal = {
    sumaEfectivo: 0,
    sumaTDC: 0,
    sumaTransferencia: 0,
    sumaCheque: 0,
    sumaTDD: 0,
    total: 0,
  };

  constructor(init?: ICashRegisterData) {
    Object.assign(this, init);
  }
}
