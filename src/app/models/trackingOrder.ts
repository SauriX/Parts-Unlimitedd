import { uniqueId } from "lodash";
import moment from "moment";
import { ITagTrackingOrder } from "./routeTracking";

export interface ITagRouteList {
  id?: string;
  claveEtiqueta: string;
  recipiente: string;
  cantidad: number;
  estudios: string;
  solicitud: string;
  ruta: string;
  estatus: string;
  escaneo: boolean;
}

export interface searchstudies {
  estudios: number[];
  solicitud: string;
}

export interface IRequestStudyOrder {
  id: number;
  clave: string;
  estudio: string;
  estatus: string;
  dias: string;
  fecha: string;
  estatusId: number;
}

export interface IStudyTrackinOrder {
  id?: number;
  etiquetaId: number;
  solicitudId?: string;
  solicitud: string;
  claveEtiqueta: string;
  recipiente: string;
  cantidad: number;
  estudios: string;
  claveRuta: string;
  estatus: number;
  escaneo?: boolean;
  extra?: boolean;
}

export interface IRouteTrackingForm {
  id?: string;
  origen: string;
  origenId?: string;
  destino: string;
  destinoId: string;
  rutaId: string;
  muestra: string;
  escaneo: boolean;
  temperatura: number;
  activo: boolean;
  clave: string;
  diaRecoleccion: moment.Moment;
  estudios: IStudyTrackinOrder[];
  etiquetas: ITagTrackingOrder[];
}

export class TrackingOrderListValues implements ITagRouteList {
  claveEtiqueta = "";
  recipiente = "";
  cantidad = 0;
  estudios = "";
  solicitud = "";
  ruta = "";
  estatus = "";
  escaneo = false;

  constructor(init?: ITagRouteList) {
    Object.assign(this, init);
  }
}
export class TrackingOrderFormValues implements IRouteTrackingForm {
  rutaId = "";
  destino = "";
  destinoId = "";
  origenId = "";
  origen = "";
  muestra = "";
  escaneo = false;
  temperatura = 0;
  escaneado = false;
  diaRecoleccion = moment().utcOffset(0, true);
  estudios: IStudyTrackinOrder[] = [];
  etiquetas: ITagTrackingOrder[] = [];
  activo = true;
  clave = "";

  constructor(init?: IRouteTrackingForm) {
    Object.assign(this, init);
  }
}
