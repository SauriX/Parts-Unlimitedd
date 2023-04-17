import moment from "moment";

export interface ILoyaltyList {
  id: string;
  clave: string;
  nombre: string;
  tipoDescuento: string;
  precioListaId: string[];
  precioLista: string[];
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
  precioLista: ILoyaltyPriceList[] | string[];
  fechaInicial?: Date;
  fechaFinal?: Date;
  activo: boolean;
  fecha: moment.Moment[];
}

export interface ILoyaltyPriceList {
  precioListaId: string;
  nombre?: string;
}

export class LoyaltyFormValues implements ILoyaltyForm {
  id = "";
  clave = "";
  nombre = "";
  precioLista: ILoyaltyPriceList[] = [];
  tipoDescuento = "";
  cantidadDescuento = 0;
  cantidad = 0;
  activo = true;
  fecha = [moment(), moment().add(1, "day")];

  constructor(init?: ILoyaltyForm) {
    Object.assign(this, init);
  }
}
