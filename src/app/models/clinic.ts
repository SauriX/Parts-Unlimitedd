export interface IClinicList {
    id: number;
    clave: string;
    nombre: string;
    activo: boolean;
    }
    
    export interface IClinicForm {
      id: number;
      clave: string;
      nombre: string;
      activo: boolean;
    }
    
    export class ClinicFormValues implements IClinicForm {
      id = 0;
      clave = "";
      nombre = "";
      activo = true;
    
      constructor(init?: IClinicForm) {
        Object.assign(this, init);
      }
    } 