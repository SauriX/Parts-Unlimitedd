export interface IIndicationList {
    idIndicacion: number;
    clave: string;
    nombre: string;
    descripcion: string;
    activo: boolean
  }
  
  export interface IIndicationForm {
    idIndicacion: number;
    clave: string;
    nombre: string;
    descripcion: string;
    activo: boolean
  }
  
  export class IndicationFormValues implements IIndicationForm {
    idIndicacion = 0;
    clave = "";
    nombre = "";
    descripcion = "";
    activo = true;
  
    constructor(init?: IIndicationForm) {
      Object.assign(this, init);
    }
  }