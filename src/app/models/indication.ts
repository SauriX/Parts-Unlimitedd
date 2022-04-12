export interface IIndicationList {
    id: number;
    clave: string;
    nombre: string;
    descripcion: string;
    activo: boolean
  }
  
  export interface IIndicationForm {
    id: number;
    clave: string;
    nombre: string;
    descripcion: string;
    activo: boolean
  }
  
  export class IndicationFormValues implements IIndicationForm {
    id = 0;
    clave = "";
    nombre = "";
    descripcion = "";
    activo = true;
  
    constructor(init?: IIndicationForm) {
      Object.assign(this, init);
    }
  }