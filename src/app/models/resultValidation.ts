import moment, { Moment } from "moment";

export interface ISearchValidation{
    fecha: moment.Moment[],
    search:string,
    departament:number,
    area:number,
    estudio:number,
    medico:string,
    tipoSoli:number,
    compañia:string,
    sucursal:string,
    estatus:number,
    
}
export interface IvalidationStudyList {
    id:number
    study:string,
    area:string,
    status:string,
    registro:moment.Moment,
    entrega:moment.Moment,
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
    departament=0;
    area=0;
    estudio=0;
    medico="";
    tipoSoli=0;
    compañia="";
    sucursal="";
    estatus=0;

    constructor(init?: ISearchValidation) {
      Object.assign(this, init);
    }
}