import moment, { Moment } from "moment";

export interface ISearchValidation{
    fecha?: moment.Moment[],
    search:string,
    departament?:number,
    area?:number,
    ciudad?:number,
    estudio:number[],
    medico:string[],
    tipoSoli:number[],
    compañia:string[],
    sucursal:string[],
    estatus:number[],
    
}
export interface IvalidationStudyList {
    id:number
    study:string,
    area:string,
    status:string,
    registro:string,
    entrega:string,
    estatus :number
    solicitudId:string,
}
export interface Ivalidationlist{
    id:string;
    solicitud:string,
    nombre:string,
    registro:string,
    sucursal:string,
    edad:string,
    sexo:string,
    compañia:string,
    estudios:IvalidationStudyList[],
    order: string;
}
export class searchValues implements ISearchValidation {
    fecha = [moment(moment.now()),moment(moment.now())]
    search="";
    departament=undefined;
    area=undefined;
    estudio=[];
    medico=[];
    tipoSoli=[];
    compañia=[];
    sucursal=[];
    estatus=[];

    constructor(init?: ISearchValidation) {
      Object.assign(this, init);
    }
}