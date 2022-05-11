import { NumberLiteralType } from "typescript";
import { IStudyList } from "./study";

export interface IPacketList {
    id: number,
    clave: string,
    nombre: string,
    nombreCorto:string,
    activo: boolean,
}

export interface IPackForm {
    id: number,
    clave: string,
    nombre: string,
    nombreLargo:string,
    idArea:number,
    idDepartamento:number,
    activo: boolean,
    visible:boolean,
    estudio: IPackEstudioList[];
}
export interface IPackEstudioList {
    id: string;
    clave: string;
    nombre: string;
    precio:number;
    area:string;
}

export class PackFormValues implements IPackForm{

    id=0;
    clave="";
    nombre="";
    nombreLargo="";
    idArea=0;
    idDepartamento=0;
    activo=false;
    visible=false;
    estudio: IPackEstudioList[]=[]  ;
    constructor(init?: IPackForm) {
        Object.assign(this, init);
      }
}