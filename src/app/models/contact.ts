export interface IContactList {
  idContacto: number;
  nombre: string;
  telefono: number;
  correo: string;
  Activo: boolean;
}

export interface IContactForm {
  id: number;
  tempId?: string;
  compañiaId: number;
  nombre: string;
  apellidos: string;
  telefono?: number;
  correo: string;
  activo: boolean;
}

export class ContactFormValues implements IContactForm {
  id = 0;
  compañiaId = 0;
  nombre = "";
  apellidos = "";
  telefono = 0;
  correo = "";
  activo = true;

  constructor(init?: IContactForm) {
    Object.assign(this, init);
  }
}
