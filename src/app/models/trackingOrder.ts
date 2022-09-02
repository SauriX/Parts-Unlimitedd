import { uniqueId } from "lodash";
import moment from "moment";

export interface IEstudiosList {
  taponNombre: string;
  estudios: ITrackingOrderList[];
  escaneado: boolean;
  temperatura: number;
  solicitud: string;
  paciente: string;
  id?: string;
}
export interface ITrackingOrderList {
  id?: number;
  clave: string;
  estudio: string;
  solicitud: string;
  paciente: string;
  escaneado?: boolean;
  temperatura: number;
}

export interface ITrackingOrderForm {
  id: number | string;
  fecha: moment.Moment;
  ruta: string;
  sucursalDestinoId: string;
  sucursalOrigenId?: string;
  muestraId: string;
  solicitudId: string;
  escaneoCodigoBarras: boolean;
  temperatura: number;
  claveEstudio: string;
  estudio: string;
  pacienteId: string;
  escaneado: boolean;
  estudios: ITrackingOrderList[];
}
export class TrackingOrderListValues implements IEstudiosList {
  taponNombre = "";
  estudios = [];
  escaneado = false;
  temperatura = 0;
  solicitud = "";
  paciente = "";
  id = uniqueId();
  constructor(init?: IEstudiosList) {
    Object.assign(this, init);
  }
}
export class TrackingOrderFormValues implements ITrackingOrderForm {
  id = "";
  fecha = moment();
  ruta = "";
  sucursalDestinoId = "";
  sucursalOrigenId = "";
  muestraId = "";
  solicitudId = "";
  escaneoCodigoBarras = false;
  temperatura = 0;
  claveEstudio = "";
  estudio = "";
  pacienteId = "";
  escaneado = false;
  estudios: ITrackingOrderList[] = [];

  constructor(init?: ITrackingOrderForm) {
    Object.assign(this, init);
  }
}
