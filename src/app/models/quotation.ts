import moment, { Moment } from "moment";
import { IIndicationList } from "./indication";
import { IParameterList } from "./parameter";
import { IRequestGeneral, IRequestPrice } from "./request";
export interface ISearchQuotation{
    presupuesto:string,
    activo:boolean,
    telefono:string,
    fechaAlta:Date,
    ciudad:string,
    sucursal:string,
    email:string,
}
export interface IQuotationList{
    id:string,
    presupuesto:string,
    nomprePaciente:string,
    estudios:string,
    email:string,
    whatsapp:string,
    fecha:Date,
    expediente:string,
    activo:boolean,
}

export interface IQuotationForm{
    id:string,
    expediente:string,
    nomprePaciente:string,
    edad:number,
    fechaNacimiento:moment.Moment,
    genero:string,
    generales?:IQuotationGeneralesForm,
    expedienteid?:string
    estudy?:IRequestPrice[]
    cargo?:number
    typo?: number
    sucursalId?:string
}
export interface ISolicitud {
    Id :string;
    ExpedienteId :string;
    SucursalId :string;
    Clave :string;
    ClavePatologica :string;
    UsuarioId :string;
    General :IRequestGeneral;
    Estudios :IRequestPrice[];
}
export interface IQuotationGeneralesForm{
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

export interface IQuotationEstudiosForm{
    codigoEstudio:string,
    nombreEstudio:string
}

export class QuotationEstudiosFormValues implements IQuotationEstudiosForm{
    codigoEstudio = "";
    nombreEstudio="";
    constructor(init?:IQuotationEstudiosForm){
        Object.assign(this,init);
    }
}
export interface IQuotationPrice {
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
export interface IQuotationExpedienteSearch{
    fechaInicial:moment.Moment,
    fechaFinal:moment.Moment,
    buscar:string,
    email:string,
    telefono:string
}
export class QuotationExpedienteSearchValues implements IQuotationExpedienteSearch{
    fechaFinal=moment( moment.now());
    fechaInicial=moment( moment.now());
    buscar = "";
    email = "";
    telefono ="";
    constructor(init?:IQuotationExpedienteSearch) {
        Object.assign(this, init);
    }
}
export class QuotationGeneralesFormValues implements IQuotationGeneralesForm{
    procedencia=undefined;
    compañia="";
    medico="";
    nomprePaciente="";
    
    observaciones="";
    tipoEnvio="";
    email="";
    whatssap="";
    activo=false;
    constructor(init?:IQuotationGeneralesForm) {
        Object.assign(this, init);
    }
}
export class SearchQuotationValues implements ISearchQuotation{
    presupuesto = "";
    telefono = "";
    fechaAlta=new  Date(moment.now());
    ciudad= "";
    sucursal= "";
    activo = false;
    email="";
    constructor(init?:ISearchQuotation) {
        Object.assign(this, init);
    }
}

 export class QuotationFormValues implements IQuotationForm{

    id="";
    expediente="";
    nomprePaciente="";
    genero="";
    edad=0;
    fechaNacimiento= moment( moment.now());
    constructor(init?:IQuotationForm) {
        Object.assign(this, init);
    }
}