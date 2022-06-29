import { IIndicationList } from "./indication";
import { IParameterList } from "./parameter";

export interface IRequestPrice {
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
