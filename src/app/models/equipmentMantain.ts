import moment from "moment";

export interface ISearchMantain {
    fecha:moment.Moment[],
    clave:string,
    idEquipo:string
}

export class SearchMantainValues implements ISearchMantain {
    fecha=[];
    clave="";
    idEquipo="";
    constructor(init?: ISearchMantain) {
      Object.assign(this, init);
    }
}

export interface IImageSend{
    solicitudId:string,
    imagen:File | Blob;
    imagenUrl:string
    clave:string
    tipo: "orden" | "ine" | "formato";
    UsuarioId?:string
}
export interface Idetail{
    clave:string,
    nombre:string,
    serie:string
    id:string
} 
export interface ImantainForm{
    id:string,
    idEquipo:string,
    fecha:moment.Moment,
    descripcion:string,
    clave :string
    no_serie :string
    ativo :boolean
    imagenUrl:string[]
    ide:number
}
export class MantainValues implements ImantainForm {
    id=""
    idEquipo=""
    fecha = moment(moment.now())
    descripcion=""
    clave =""
    no_serie =""
    ativo=false
    imagenUrl=[]
    ide=0
    constructor(init?: ImantainForm) {
      Object.assign(this, init);
    }
}
export interface IMantainList {
    id:string
    clave:string,
    fecha:moment.Moment,
    activo:boolean
}
