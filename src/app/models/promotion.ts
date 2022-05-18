import { ISucMedComList } from "./priceList";

export interface IPromotionList {
    id:number,
    clave:string,
    nombre:string,
    periodo:string,
    nombreListaPrecio:string,
    activo:boolean
}
export interface IPromotionEstudioList{
    clave:string,
    nombre:string,
    descuentoPorcentaje:number,
    descuentoCantidad:number,
    lealtad:boolean,
    fechaInicial:Date,
    fechaFinal:Date,
    activo:boolean,
    precio:number,
    paquete:boolean,
}
export interface IPromotionForm{
    id:number,
    clave:string,
    nombre:string,
    tipoDescuento:string,
    cantidad:number,
    fechaInicial?:Date
    fechaFinal?:Date,
    idListaPrecios:string,
    activo:boolean,
    lealtad:boolean
    estudio: IPromotionEstudioList[];
    sucMedCom: ISucMedComList[];
}

export class IPromotionFormValues implements IPromotionForm{
    id=0;
    clave="";
    nombre="";
    tipoDescuento="";
    cantidad=0;
    idListaPrecios= "";
    activo=false;
    lealtad=false;
    estudio: IPromotionEstudioList[] =[];
    sucMedCom: ISucMedComList[]=[];

    constructor(init?:IPromotionForm) {
        Object.assign(this, init);
      }
}


