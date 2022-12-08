import moment, { Moment } from "moment";

export interface checked{
    idSolicitud:string;
    idstudio:number;
}

export interface ISearchRelase{
    fecha: moment.Moment[],
    search:string,
    departament?:number,
    area?:number,
    estudio:number[],
    medico:string[],
    tipoSoli:number[],
    compañia:string[],
    sucursal:string[],
    estatus:number[],
    
}
export interface IrelaceStudyList {
    id:number
    study:string,
    area:string,
    status:string,
    registro:string,
    entrega:string,
    estatus :number
    solicitudId:string,
    tipo:boolean
}
export interface Irelacelist{
    id:string;
    solicitud:string,
    nombre:string,
    registro:string,
    sucursal:string,
    edad:string,
    sexo:string,
    compañia:string,
    estudios:IrelaceStudyList[],
    order: string;
    parcialidad:boolean

}
export class searchrelase implements ISearchRelase {
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

    constructor(init?:ISearchRelase) {
      Object.assign(this, init);
    }
}