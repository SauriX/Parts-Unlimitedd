import moment from "moment";

export interface ILoyaltyList {
  id: string;
  clave: string;
  nombre: string;
  tipoDescuento: string;
  idListaPrecios:string,
  cantidadDescuento: number;
  fechaInicial: Date;
  fechaFinal: Date;
  activo: boolean;
}

export interface ILoyaltyForm {
  id: string;
  clave: string;
  nombre: string;
  tipoDescuento: string;
  cantidadDescuento: number;
  cantidad: number;
  idListaPrecios:string,
  fechaInicial?: Date;
  fechaFinal?: Date;
  activo: boolean;
  fecha: moment.Moment[];
}
export class LoyaltyFormValues implements ILoyaltyForm {
  id = "";
  clave = "";
  nombre = "";
  idListaPrecios= "";
  tipoDescuento = "";
  cantidadDescuento = 0;
  cantidad = 0;
  activo = true;
  fecha = [moment(Date.now()), moment(Date.now()).add("day", 1)];

  constructor(init?: ILoyaltyForm) {
    Object.assign(this, init);
  }
}
