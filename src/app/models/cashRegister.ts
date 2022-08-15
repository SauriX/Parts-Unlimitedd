import moment from "moment";

export interface ICashRegisterData {
  porDia: ICommonData[];
  canceladas: ICommonData[];
  otroDia: ICommonData[];
  invoice: Invoice[];
}

interface ICommonData {
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

interface Invoice {

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