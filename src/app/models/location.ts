  import { ICatalog } from "./shared";

export interface ILocation {
    codigoPostal: string;
    estado: string;
    ciudad: string;
    colonias: ICatalog[];
  }