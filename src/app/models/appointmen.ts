import moment, { Moment } from "moment";
import { IIndicationList } from "./indication";
import { IParameterList } from "./parameter";

import { IRequestGeneral, IRequestStudy } from "./request";

export interface generalDomicilio{
    recoleccion?:string,
    direccion:string,
    general:string,
    nomprePaciente:string,
    observaciones:string,
    tipoEnvio:string,
    email:string,
    whatssap:string,
    activo:boolean,
    numero:string
}

export interface ISearchAppointment{
    fecha: moment.Moment[];
    nombre:string,
    tipo:string,
}

export interface IExportForm{
    id:string
    tipo:string
}
export interface IAppointmentList{
    id:string,
    noSolicitud: string,
    fecha: Date,
    direccion: string,
    nombre: string,
    edad: Number,
    sexo: string,
    tipo:number,
    expediente:string

}

export interface IAppointmentForm{
    id:string,
    expediente:string,
    nomprePaciente:string,
    edad:number,
    fechaNacimiento:moment.Moment,
    genero:string,
    generales?:IAppointmentGeneralesForm,
    expedienteid?:string
    estudy?:IRequestStudy[]
    cargo?:number
    typo?: number
    sucursalId?:string
    tipo?:string
    generalesDom?:generalDomicilio
    fecha?:moment.Moment
    status?:number
}
export interface ISolicitud {
    Id :string;
    ExpedienteId :string;
    SucursalId :string;
    Clave :string;
    ClavePatologica :string;
    UsuarioId :string;
    General :IRequestGeneral;
    Estudios :IRequestStudy[];
}
export interface IAppointmentGeneralesForm{
    procedencia?:string,
    compañia:string,
    medico:string,
    nomprePaciente:string,
    observaciones:string,
    tipoEnvio:string,
    email:string,
    whatssap:string,
    activo:boolean,

}

export interface IAppointmentEstudiosForm{
    codigoEstudio:string,
    nombreEstudio:string
}

export class AppointmentEstudiosFormValues implements IAppointmentEstudiosForm{
    codigoEstudio = "";
    nombreEstudio="";
    constructor(init?:IAppointmentEstudiosForm){
        Object.assign(this,init);
    }
}
export interface IAppointmentPrice {
    precioListaId: string;
    type: "study" | "pack";
    estudioId?: number;
    paqueteId?: number;
    clave: string;
    nombre: string;
    precio: number;
    precioFinal: number;
    descuento: boolean;
    cargo: boolean;
    copago: boolean;
    parametros: IParameterList[];
    indicaciones: IIndicationList[];
}
export interface IAppointmentExpedienteSearch{
    fechaInicial:moment.Moment,
    fechaFinal:moment.Moment,
    buscar:string,
    email:string,
    telefono:string
}
export class AppointmentExpedienteSearchValues implements IAppointmentExpedienteSearch{
    fechaFinal=moment( moment.now());
    fechaInicial=moment( moment.now());
    buscar = "";
    email = "";
    telefono ="";
    constructor(init?:IAppointmentExpedienteSearch) {
        Object.assign(this, init);
    }
}
export class AppointmentGeneralesFormValues implements IAppointmentGeneralesForm{
    procedencia=undefined;
    compañia="";
    medico="";
    nomprePaciente="";
    
    observaciones="";
    tipoEnvio="";
    email="";
    whatssap="";
    activo=false;
    constructor(init?:IAppointmentGeneralesForm) {
        Object.assign(this, init);
    }
}
export class AppointmentGeneralesFormDomValues implements generalDomicilio{
    recoleccion="";
    direccion="";
    general="";
    nomprePaciente="";
    observaciones="";
    tipoEnvio="";
    email="";
    whatssap="";
    activo=false;
    numero="";
    constructor(init?:generalDomicilio) {
        Object.assign(this, init);
    }
}
export class SearchAppointmentValues implements ISearchAppointment{
    fecha= [moment(Date.now()),moment(Date.now())];
    nombre= ""
    tipo="laboratorio"
    constructor(init?:ISearchAppointment) {
        Object.assign(this, init);
    }
}

 export class AppointmentFormValues implements IAppointmentForm{

    id="";
    expediente="";
    nomprePaciente="";
    genero="";
    edad=0;
    fechaNacimiento= moment( moment.now());
    constructor(init?:IAppointmentForm) {
        Object.assign(this, init);
    }
}