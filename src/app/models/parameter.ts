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
    tipoValor:string,
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
    formatoImpresion:string
}

export class ParameterFormValues implements IParameterForm{
    id = "";
    clave = "";
    nombre = "";
    nombreCorto = "";
    unidades = "";
    tipoValor = "";
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
    formatoImpresion ="";

    constructor(init?: IParameterForm) {
        Object.assign(this, init);
    }
}