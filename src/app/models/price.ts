export interface IPriceListList {
    id: number;
    clave: string;
    nombre: string;
    visibilidad: boolean;
    activo: boolean;
  }

  
export interface IPriceListForm {
  id: number;
    clave: string;
    nombre: string;
    visibilidad: boolean;
    activo: boolean;
    //Promocion: IPromotionForm[];
  }
  export class PriceListFormValues implements IPriceListForm {
   
    id= 0;
    clave= "";
    nombre= "";
    visibilidad= true
    activo= true;
    //Promocion: IPromotionForm[] = [];
  
    constructor(init?: IPriceListForm) {
      Object.assign(this, init);
    }
}