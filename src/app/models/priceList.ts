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
    idArea:number,
    idDepartamento:number,
    activo: boolean;
    estudio: IPriceListEstudioList[];
    sucMedCom: ISucMedComList[];
  }
  export class PriceListFormValues implements IPriceListForm {
   
    id= "";
    clave= "";
    nombre= "";
    visibilidad= true
    idArea=0;
    idDepartamento=0;
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
  area:string;
  activo: boolean;
  departamento: string;
}


export interface IPriceListEstudioList {
  id:number | string;
  clave: string;
  nombre: string;
  precio?:number;
  area:string;
  activo: boolean;
  departamento: string;
}