export interface IMedicsList {
    idMedico: number;
    clave: string;
    nombre: string;
    especialidad: number;
    observaciones: string;
    direccion: string
    coreo: string; 
    celular: number;
    telefono: number;
    activo: boolean
  }
  
  export interface IMedicsForm {
    idMedico: number;
    clave: string;
    nombre: string;
    especialidadId: number;
    observaciones: string;
    codigoP: string
    estado: string;
    ciudad: string;
    numeroExterior: number;
    numeroInterior: number;
    calle: string;
    colonia: string;
    correo: string; 
    celular: number;
    telefono: number;
    activo: boolean
  }
  
  export class MedicsFormValues implements IMedicsForm {
    idMedico = 0;
    clave = "";
    nombre = "";
    especialidadId = 0;
    observaciones = "";
    codigoP= ""
    estado= "";
    ciudad= "";
    numeroExterior= 0;
    numeroInterior= 0;
    calle= "";
    colonia= "";
    correo = "";
    celular = 0 ;
    telefono = 0 ;
    activo = true;
  
    constructor(init?: IMedicsForm) {
      Object.assign(this, init);
    }
  }