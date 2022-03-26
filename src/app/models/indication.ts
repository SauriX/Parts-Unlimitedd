export interface IIndicationList {
    idIndicacion: number;
    clave: string;
    nombre: string;
    descripcion: strint;
    activo: boolean
  }
  
  export interface IIndicationForm {
    idIndicacion: number;
    clave: string;
    nombre: string;
    descripcion: strint;
    activo: boolean
  }
  
  export class IndicationFormValues implements IIndicatonForm {
    idIndicacion = 0;
    clave = "";
    nombre = "";
    descripcion = "";
    activo = true;
  
    constructor(init?: IIndicatonForm) {
      Object.assign(this, init);
    }
  }