import moment from "moment";

export interface SearchTracking {
  fecha: moment.Moment[];
  destino: string;
  origen: string;
  buscar: string;
}

export interface IRouteTrackingList {
  id: string;
  seguimiento: string;
  claveEtiqueta: string;
  recipiente: string;
  cantidad: number;
  estudios: string;
  solicitud: string;
  estatus: string;
  ruta: string;
  entrega: string;
}

export interface ITagTrackingOrder{
  id: number;
  claveEtiqueta: string;
  recipiente: string;
  cantidad: number;
  estudios: string;
  solicitud: string;
  estatus: string;
  escaneo: boolean;
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
  fecha = [moment(), moment()];
  buscar = "";
  destino = "";
  origen = "";

  constructor(init?: SearchTracking) {
    Object.assign(this, init);
  }
}
