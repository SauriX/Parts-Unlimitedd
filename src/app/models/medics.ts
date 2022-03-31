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
  
  export class MedicsFormValues implements IMedicsForm {
    idMedico = 0;
    clave = "";
    nombre = "";
    especialidadId = 0;
    observaciones = "";
    codigoPostal= 0;
    estadoId= 0;
    ciudadId= 0;
    numeroExterior= 0;
    numeroInterior= 0;
    calle= "";
    coloniaId= 0;
    correo = "";
    celular = 0 ;
    telefono = 0 ;
    activo = true;
  
    constructor(init?: IMedicsForm) {
      Object.assign(this, init);
    }
  }