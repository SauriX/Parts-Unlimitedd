import moment from "moment";
import { IDias } from "./route";

export interface INotificationsList {
  id: string;
  clave: string;
  titulo: string;
  fecha: string;
  activo: boolean;
  contenido: string;
}

export interface INotificationForm {
  id?: string;
  titulo: string;
  contenido: string;
  isNotifi: boolean;
  fechas: moment.Moment[];
  activo: boolean;
  sucursales: string[];
  roles: string[];
  dias: IDias[];
}

export interface INotificationFilter {
  sucursalId?: string;
  rolId?: string;
}
export class NotificationValues implements INotificationForm {
  titulo = "";
  contenido = "";
  isNotifi = false;
  fechas = [moment(), moment()];
  activo = false;
  sucursales = [];
  roles = [];
  dias = [];
  constructor(init?: INotificationForm) {
    Object.assign(this, init);
  }
}
