import { IOptions } from "./shared"
import { IStudyList } from "./study";
export interface IParameterList {
    id:string,
    clave:string,
    nombre:string,
    nombreCorto:string,
    area:string,
    departamento:string,
    activo:boolean
}

export interface IParameterForm {
    id:string,
    clave:string,
    nombre:string,
    nombreCorto:string,
    unidades:string,
    tipoValor:number,
    formula:string,
    formato:string,
    valorInicial:string,
    departamento:number,
    area:number,
    reactivo:number,
    unidadSi:string,
    fcs:string,
    activo:boolean,
    estudios:IStudyList[],
    formatoImpresion:number;
}
export interface ItipoValorForm{
    id?:string,
    idParametro?:string,
    nombre?:string,
    valorInicial?:number, 
    valorFinal?:number,
    valorInicialNumerico?:number,
    valorFinalNumerico?:number,
    rangoEdadInicial?:number,
    rangoEdadFinal?:number,
    hombreValorInicial?:number, 
    hombreValorFinal?:number,
    mujerValorInicial?:number,
    mujerValorFinal?:number,
    medidaTiempo?:number,
    opcion?:string|"",
    descripcionTexto?:string|"",
    descripcionParrafo?:string|"",
}

export class ParameterFormValues implements IParameterForm{
    id = "";
    clave = "";
    nombre = "";
    nombreCorto = "";
    unidades = "";
    tipoValor = 0;
    formula = "";
    formato = "";
    valorInicial = "";
    departamento = 0;
    area = 0;
    reactivo = 0;
    unidadSi = "";
    fcs = "";
    activo = false;
    estudios: IStudyList[]=[];
    formatoImpresion =0;

    constructor(init?: IParameterForm) {
        Object.assign(this, init);
    }
}

export class tipoValorFormValues implements ItipoValorForm {
    id="";
    idParametro="";
    nombre="";
    valorInicial=0; 
    valorFinal=0;
    valorInicialNumerico=0;
    valorFinalNumerico=0;
    rangoEdadInicial=0;
    rangoEdadFinal=0;
    hombreValorInicial=0; 
    hombreValorFinal=0;
    mujerValorInicial=0;
    mujerValorFinal=0;
    medidaTiempo=0;
    opcion="";
    descripcionTexto="";
    descripcionParrafo="";
    constructor(init?: ItipoValorForm) {
        Object.assign(this, init);
    }
}