export interface IMedicsList {
  idMedico: number;
  clave: string;
  nombre: string;
  especialidadId: number;
  observaciones: string;
  codigoPostal: number
  estadoId: number;
  ciudadId: number;
  numeroExterior: number;
  numeroInterior: number;
  calle: string;
  coloniaId: number;
  correo: string; 
  celular: number;
  telefono: number;
  activo: boolean;
  }
  
  export interface IMedicsForm {
    idMedico: number;
    clave: string;
    nombre: string;
    especialidadId?: number;
    observaciones: string;
    codigoPostal: number
    estadoId?: number;
    ciudadId?: number;
    numeroExterior: number;
    numeroInterior?: number;
    calle: string;
    coloniaId: number;
    correo?: string; 
    celular?: number;
    telefono?: number;
    activo: boolean;
  }
  
  export class MedicsFormValues implements IMedicsForm {
    idMedico = 0;
    clave = "";
    nombre = "";
    especialidadId = undefined;
    observaciones = "";
    codigoPostal= 0;
    estadoId= undefined;
    ciudadId= undefined;
    numeroExterior= 0;
    numeroInterior= undefined;
    calle= "";
    coloniaId= 0;
    correo = "";
    celular = undefined ;
    telefono = undefined ;
    activo = true;
  
    constructor(init?: IMedicsForm) {
      Object.assign(this, init);
    }
  }