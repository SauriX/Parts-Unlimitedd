export interface ILoyaltyList {
  id:string;
  clave: string;
  nombre: string;
  tipoDescuento: number;
  cantidadDescuento: string;
  fechaInicial: Date;
  fechaFinal: Date;
  activo: boolean;
}

export interface ILoyaltyForm {
    id:string;
    clave: string;
    nombre: string;
    tipoDescuento: number;
    cantidadDescuento: string;
    fechaInicial?: Date;
    fechaFinal?: Date;
    activo: boolean;
}
export class LoyaltyFormValues implements ILoyaltyForm {
  id = "";
  clave = "";
  nombre = "";
  tipoDescuento = 0;
  cantidadDescuento = "";
  activo = true;

  constructor(init?: ILoyaltyForm) {
    Object.assign(this, init);
  }
}