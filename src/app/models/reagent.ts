export interface IReagentList {
  id: number;
  clave: string;
  nombre: string;
  claveSistema: string;
  nombreSistema: string;
  activo: boolean;
}

export interface IReagentForm {
  id: number;
  clave: string;
  nombre: string;
  claveSistema: string;
  nombreSistema: string;
  activo: boolean;
}

export class ReagentFormValues implements IReagentForm {
  id = 0;
  clave = "";
  nombre = "";
  claveSistema = "";
  nombreSistema = "";
  activo = true;

  constructor(init?: IReagentForm) {
    Object.assign(this, init);
  }
}
