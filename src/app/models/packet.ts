import { NumberLiteralType } from "typescript";
import { IStudyList } from "./study";

export interface IPacketList {
  id: number;
  clave: string;
  nombre: string;
  nombreLargo: string;
  activo: boolean;
  area?: string;
  departamento?: string;
  pack?: IPackEstudioList[];
}

export interface IPackForm {
  id: number;
  clave: string;
  nombre: string;
  nombreLargo: string;
  idArea: number;
  idDepartamento: number;
  activo: boolean;
  visible: boolean;
  estudio: IPackEstudioList[];
}
export interface IPackEstudioList {
  id: number;
  clave: string;
  nombre: string;
  area: string;
  departamento: string;
  activo: boolean;
}

export class PackFormValues implements IPackForm {
  id = 0;
  clave = "";
  nombre = "";
  nombreLargo = "";
  idArea = 1;
  idDepartamento = 1;
  activo = true;
  visible = false;
  estudio: IPackEstudioList[] = [];
  constructor(init?: IPackForm) {
    Object.assign(this, init);
  }
}
