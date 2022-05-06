import { IClinicList } from "./clinic";

export interface IMedicsList {
  idMedico: number;
  clave: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  especialidad: string;
  especialidadId: number;
  observaciones: string;
  codigoPostal?: number;
  estado: string;
  ciudad: string;
  numeroExterior: string;
  numeroInterior: string;
  calle: string;
  coloniaId?: number;
  correo: string;
  celular: number;
  telefono: number;
  activo: boolean;
  clinicas: IClinicList[];
}

export interface IMedicsForm {
  idMedico: number;
  clave: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  especialidadId?: number;
  observaciones: string;
  codigoPostal?: number;
  estado?: string;
  ciudad?: string;
  numeroExterior: string;
  numeroInterior?: string;
  calle: string;
  coloniaId?: number;
  correo?: string;
  celular?: number;
  telefono?: number | string;
  activo: boolean;
  clinicas: IClinicList[];
}
export class MedicsFormValues implements IMedicsForm {
  idMedico = 0;
  clave = "";
  nombre = "";
  primerApellido = "";
  segundoApellido = "";
  especialidadId = undefined;
  observaciones = "";
  codigoPostal = undefined;
  estado = "";
  ciudad = "";
  numeroExterior = "";
  numeroInterior = "";
  calle = "";
  coloniaId = undefined;
  correo = "";
  celular = undefined;
  telefono = undefined;
  activo = true;
  clinicas: IClinicList[] = [];

  constructor(init?: IMedicsForm) {
    Object.assign(this, init);
  }
}

// export interface IClave {
//   nombre : string
//   primerApllido : string
//   segundoApellido : string
// }

// export class claveValues implements IClave{
//   nombre = "";
//   primerApllido = "";
//   segundoApellido = "";
//   constructor(init?: IClave){
//     Object.assign(this,init);
//   }
// }
