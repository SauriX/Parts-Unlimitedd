import { IOptions } from "./shared"
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
    activo:boolean
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

    constructor(init?: IParameterForm) {
        Object.assign(this, init);
    }
}