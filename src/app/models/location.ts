  import { ICatalog } from "./shared";

export interface ILocation {
    codigoPostal: string;
    estado: string;
    ciudad: string;
    colonias: ICatalog[];
  }

  export interface ICity {
    id:number ;
    EstadoId :number; 
    ciudad:string ;
  }