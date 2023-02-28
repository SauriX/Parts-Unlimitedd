import moment from "moment";

export interface SearchTracking {
  fechas: moment.Moment[];
  destino: string;
  origen: string;
  buscar: string;
}

export interface IRouteList {
  id: string;
  seguimiento: string;
  clave: string;
  etiqueta: string;
  cantidad: number;
  estudios: string;
  solicitud: string;
  estatus: string;
  ruta: string;
  entrega: string;
}

export interface IstudyRoute {
  id: number;
  nombre: string;
  area: string;
  status: number;
  registro: string;
  entrega: string;
  seleccion: boolean;
  clave: string;
  expedienteid: string;
  solicitudid: string;
  nombreEstatus: string;
  routeId: string;
}

export class TrackingFormValues implements SearchTracking {
  fechas = [moment(), moment()];
  buscar = "";
  destino = "";
  origen = "";

  constructor(init?: SearchTracking) {
    Object.assign(this, init);
  }
}
