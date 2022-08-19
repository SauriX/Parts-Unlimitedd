import moment from "moment";

export interface ISearchMantain {
    fecha:moment.Moment[],
    clave:string,
}

export class SearchMantainValues implements ISearchMantain {
    fecha=[];
    clave="";
  
    constructor(init?: ISearchMantain) {
      Object.assign(this, init);
    }
}

export interface IImageSend{
    SolicitudId:string,
    Imagen:File | Blob;
    ImagenUrl:string
    clave:string
    tipo: "orden" | "ine" | "formato";
    UsuarioId:string
}

export interface ImantainForm{
    id:string,
    idEquipo:string,
    fecha:moment.Moment,
    descripcion:string,
    clave :string
    no_serie :string
    ativo :string
}
export interface IMantainList {
    id:string
    clave:string,
    fecha:moment.Moment,
    activo:boolean
}