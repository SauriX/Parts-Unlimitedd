export interface IContactList {
  idContacto: number;
    nombre: string;
    telefono: number;
    correo: string;
    Activo: boolean;
  }
  
  export interface IContactForm {
    idContacto: number;
    CompañiaId: number;
    nombre: string;
    apellidos: string;
    telefono: number;
    correo: string;
    activo: boolean;
  }
  
  export class ContactFormValues implements IContactForm {
    idContacto = 0;
    CompañiaId= 0;
    nombre= "";
    apellidos= "";
    telefono= 0;
    correo= "";
    activo = true;
  
    constructor(init?: IContactForm) {
      Object.assign(this, init);
    }
  }
  