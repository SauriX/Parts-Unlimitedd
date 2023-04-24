import moment from "moment";

export interface ISearchTracking {
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
  estatusSeguimiento: number;
  extra: boolean;
}

export interface ITagTrackingOrder {
  id: number;
  claveEtiqueta: string;
  claveRuta: string;
  recipiente: string;
  cantidad: number;
  estudios: string;
  solicitud: string;
  solicitudId: string;
  estatus: number;
  escaneo: boolean;
  extra: boolean;
  estudiosId: number[];
}

export class PendingSendValues implements ISearchTracking {
  fecha = [moment(), moment()];
  buscar = "";
  destino = "";
  origen = "";

  constructor(init?: ISearchTracking) {
    Object.assign(this, init);
  }
}
