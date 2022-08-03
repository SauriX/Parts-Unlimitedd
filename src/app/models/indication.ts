import { IStudyList } from "./study";
export interface IIndicationList {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  dias?: number;
  estudios: IStudyList[];
}

export interface IIndicationForm {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  estudios: IStudyList[];
}

export class IndicationFormValues implements IIndicationForm {
  id = 0;
  clave = "";
  nombre = "";
  descripcion = "";
  activo = true;
  estudios: IStudyList[] = [];

  constructor(init?: IIndicationForm) {
    Object.assign(this, init);
  }
}
