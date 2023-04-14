import moment from "moment";

export interface IRouteList {
  id: string;
  clave: string;
  nombre: string;
  origen: string;
  destino: string;
  activo: boolean;
}

export interface IRouteForm {
  id: string;
  clave: string;
  nombre: string;
  origenId?: string;
  destinoId?: string;
  maquiladorId?: string | number;
  paqueteriaId: number;
  comentarios: string;
  horaDeRecoleccion: moment.Moment | Date;
  tiempoDeEntrega: number;
  tipoTiempo?: number;
  activo: boolean;
  estudio: IStudyRouteList[];
  dias: IDias[];
}

export interface IDias {
  id: number;
  dia: string;
}

export interface IStudyRouteList {
  id: number;
  clave: string;
  nombre: string;
  area: string;
  departamento: string;
  activo: boolean;
}

export class RouteFormValues implements IRouteForm {
  id = "";
  clave = "";
  nombre = "";
  activo = false;
  origenId = "";
  destinoId = "";
  maquiladorId = 0;
  paqueteriaId = 0;
  comentarios = "";
  horaDeRecoleccion = moment(Date.now()).utcOffset(0, true);
  tiempoDeEntrega = 0;
  tipoTiempo = 1;
  estudio: IStudyRouteList[] = [];
  dias: IDias[] = [];

  constructor(init?: IRouteForm) {
    Object.assign(this, init);
  }
}
