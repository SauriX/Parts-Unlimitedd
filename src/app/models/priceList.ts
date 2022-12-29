import React from "react";
import { IIndicationList } from "./indication";
import { IPackEstudioList } from "./packet";
import { IParameterList } from "./parameter";

export interface IPriceListList {
  id: number | string;
  clave: string;
  nombre: string;
  visibilidad: boolean;
  activo: boolean;
  estudios?: IPriceListEstudioList[];
  compañia?: ISucMedComList[];
}

export interface IPriceListForm {
  id: number | string;
  clave: string;
  nombre: string;
  visibilidad: boolean;
  idArea: number;
  idDepartamento: number;
  activo: boolean;
  estudios: IPriceListEstudioList[];
  paquete: IPriceListEstudioList[];
  sucMedCom: ISucMedComList[];
  sucursales: ISucMedComList[];
  compañia: ISucMedComList[];
  medicos: ISucMedComList[];
  promocion?: ISucMedComList[];
  table?: IPriceListEstudioList[];
}
export class PriceListFormValues implements IPriceListForm {
  id = "";
  clave = "";
  nombre = "";
  visibilidad = true;
  idArea = 0;
  idDepartamento = 0;
  activo = true;
  estudios: IPriceListEstudioList[] = [];
  sucMedCom: ISucMedComList[] = [];
  sucursales: ISucMedComList[] = [];
  compañia: ISucMedComList[] = [];
  medicos: ISucMedComList[] = [];
  paquete: IPriceListEstudioList[] = [];

  constructor(init?: IPriceListForm) {
    Object.assign(this, init);
  }
}

export interface ISucMedComList {
  id: string;
  clave: string;
  nombre: string;
  precio?: number;
  area?: string;
  activo?: boolean;
  departamento?: string;
  sucursal?: boolean;
  medico?: boolean;
  compañia?: boolean;
  listaPrecio?: string;
}

export interface IPriceListEstudioList {
  id: number;
  estudioId: number;
  clave: string;
  nombre: string;
  precio?: number;
  area?: string;
  activo?: boolean;
  departamento?: string;
  paqute?: boolean;
  descuento?: number;
  descuenNum?: number;
  precioFinal?: number;
  pack?: IPackEstudioList[];
  form?:React.ReactNode
  check?:React.ReactNode
}

export interface IPriceListInfoFilter {
  estudioId?: number;
  paqueteId?: number;
  sucursalId?: string;
  medicoId?: string;
  compañiaId?: string;
}

export interface IPriceListInfoStudy {
  listaPrecioId: string;
  listaPrecio: string;
  estudioId: number;
  clave: string;
  nombre: string;
  taponId?: number;
  taponColor?: string;
  taponClave?: string;
  taponNombre?: string;
  departamentoId: number;
  areaId: number;
  dias: number;
  horas: number;
  fechaEntrega: moment.Moment;
  precio: number;
  promocionId?: number;
  promocion?: string;
  descuento?: number;
  descuentoPorcentaje?: number;
  precioFinal: number;
  promociones: IPriceListInfoPromo[];
  parametros: IParameterList[];
  indicaciones: IIndicationList[];
}

export interface IPriceListInfoPack {
  listaPrecioId: string;
  listaPrecio: string;
  paqueteId: number;
  clave: string;
  nombre: string;
  departamentoId: number;
  areaId: number;
  dias: number;
  horas: number;
  precio: number;
  descuento: number;
  descuentoPorcentaje: number;
  promocionId?: number;
  promocion?: string;
  promocionDescuento?: number;
  promocionDescuentoPorcentaje?: number;
  precioFinal: number;
  promociones: IPriceListInfoPromo[];
  estudios: IPriceListInfoStudy[];
}

export interface IPriceListInfoPromo {
  promocionId: number;
  promocion: string;
  descuento: number;
  descuentoPorcentaje: number;
}
