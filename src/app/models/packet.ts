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
    estudios:IStudyList[]
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
    estudios:IStudyList[]=[];
    constructor(init?: IPackForm) {
        Object.assign(this, init);
      }
}