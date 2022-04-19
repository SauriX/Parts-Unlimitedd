export interface IContactList {
    id: number;
    CompañiaId: number;
    nombre: string;
    apellidos: string;
    telefono: number;
    correo: string;
    activo: boolean;
  }
  
  export interface IContactForm {
    id: number;
    CompañiaId: number;
    nombre: string;
    apellidos: string;
    telefono: number;
    correo: string;
    activo: boolean;
  }
  
  export class ContactFormValues implements IContactForm {
    id = 0;
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
  