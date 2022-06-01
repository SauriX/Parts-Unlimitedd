import { IPackEstudioList } from "./packet";
import { IStudyForm, IStudyList } from "./study";

export interface IPriceListList {
    id: number | string;
    clave: string;
    nombre: string;
    visibilidad: boolean;
    activo: boolean;
    estudios: IPriceListEstudioList[];
    compañia: ISucMedComList[];
  }

  
export interface IPriceListForm {
  id: number | string;
    clave: string;
    nombre: string;
    visibilidad: boolean;
    idArea:number,
    idDepartamento:number,
    activo: boolean;
    estudios: IPriceListEstudioList[];
    paquete: IPriceListEstudioList[];
    sucMedCom: ISucMedComList[];
    sucursales: ISucMedComList[];
    compañia: ISucMedComList[];
    medicos: ISucMedComList[];
    promocion?:ISucMedComList[];
    table?: IPriceListEstudioList[];
  }
  export class PriceListFormValues implements IPriceListForm {
   
    id= "";
    clave= "";
    nombre= "";
    visibilidad= true
    idArea=0;
    idDepartamento=0;
    activo= true;
    estudios: IPriceListEstudioList[] = [];
    sucMedCom: ISucMedComList[] = [];
    sucursales: ISucMedComList[]=[];
    compañia: ISucMedComList[]=[];
    medicos: ISucMedComList[]=[];
    paquete: IPriceListEstudioList[]=[];
    
    constructor(init?: IPriceListForm) {
      Object.assign(this, init);
    }
}

export interface ISucMedComList {
  id: string;
  clave: string;
  nombre: string;
  precio?:number;
  area?:string;
  activo?: boolean;
  departamento?: string;
  sucursal?:boolean,
  medico?:boolean,
  compañia?:boolean
}


export interface IPriceListEstudioList {
  id:number;
  estudioId: number;
  clave: string;
  nombre: string;
  precio?:number;
  area?:string;
  activo?: boolean;
  departamento?: string;
  paqute?:boolean;
  pack?:IPackEstudioList[];
}