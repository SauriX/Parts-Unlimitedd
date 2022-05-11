import { IStudyForm, IStudyList } from "./study";

export interface IPriceListList {
    id: string;
    clave: string;
    nombre: string;
    visibilidad: boolean;
    activo: boolean;
    estudios: IStudyList[];
    compañia: ISucMedComList[];
  }

  
export interface IPriceListForm {
  id: string;
    clave: string;
    nombre: string;
    visibilidad: boolean;
    activo: boolean;
    estudio: IPriceListEstudioList[];
    sucMedCom: ISucMedComList[];
  }
  export class PriceListFormValues implements IPriceListForm {
   
    id= "";
    clave= "";
    nombre= "";
    visibilidad= true
    activo= true;
    estudio: IPriceListEstudioList[] = [];
    sucMedCom: ISucMedComList[] = [];
  
    constructor(init?: IPriceListForm) {
      Object.assign(this, init);
    }
}

export interface ISucMedComList {
  id: string;
  clave: string;
  nombre: string;
}


export interface IPriceListEstudioList {
  id: string;
  clave: string;
  nombre: string;
  precio:number;
  area:string;
}