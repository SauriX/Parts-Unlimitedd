export interface IReagentList {
  id: string;
  clave: string;
  nombre: string;
  claveSistema: string;
  nombreSistema: string;
  activo: boolean;
}

export interface IReagentForm {
  id?: string;
  clave: string;
  nombre: string;
  claveSistema: string;
  nombreSistema: string;
  activo: boolean;
}

export class ReagentFormValues implements IReagentForm {
  clave = "";
  nombre = "";
  claveSistema = "";
  nombreSistema = "";
  activo = true;

  constructor(init?: IReagentForm) {
    Object.assign(this, init);
  }
}
