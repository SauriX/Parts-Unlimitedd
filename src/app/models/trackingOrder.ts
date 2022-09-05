import { uniqueId } from "lodash";
import moment from "moment";

export interface IEstudiosList {
  taponNombre: string;
  estudios: ITrackingOrderList[];
  escaneado: boolean;
  temperatura: number;
  solicitud: string;
  nombrePaciente: string;
  id?: string;
  solicitudId: string;
}
export interface ITrackingOrderList {
  id?: number;
  clave: string;
  estudio: string;
  solicitud: string;
  nombrePaciente: string;
  escaneado?: boolean;
  temperatura: number;
  solicitudId: string;
  estudioId: number;
  expedienteId: string;
}

export interface ITrackingOrderForm {
  id: number | string;
  sucursalOrigenId?: string;
  SucursalDestinoNombre: string;
  sucursalDestinoId: string;
  SucrusalOrigenNombre: string;
  maquiladorId: number;
  rutaId: string;
  RutaNombre: string;
  muestraId: string;
  escaneoCodigoBarras: boolean;
  temperatura: number;
  activo: boolean;
  clave: string;

  estudios: ITrackingOrderList[];
  horaDeRecoleccion: number | undefined;

  fecha: moment.Moment;
  solicitudId: string;
  claveEstudio: string;
  estudio: string;
  pacienteId: string;
  escaneado: boolean;
}
export class TrackingOrderListValues implements IEstudiosList {
  taponNombre = "";
  estudios = [];
  escaneado = false;
  temperatura = 0;
  solicitud = "";
  nombrePaciente = "";
  solicitudId = "";
  id = uniqueId();
  constructor(init?: IEstudiosList) {
    Object.assign(this, init);
  }
}
export class TrackingOrderFormValues implements ITrackingOrderForm {
  id = "";
  fecha = moment();
  rutaId = "";
  RutaNombre = "";
  sucursalDestinoId = "";
  SucursalDestinoNombre = "";
  sucursalOrigenId = "";
  SucrusalOrigenNombre = "";
  muestraId = "";
  solicitudId = "";
  escaneoCodigoBarras = false;
  temperatura = 0;
  claveEstudio = "";
  estudio = "";
  pacienteId = "";
  escaneado = false;
  estudios: ITrackingOrderList[] = [];
  activo = true;
  maquiladorId = 0;
  horaDeRecoleccion = 0;
  clave = "";

  constructor(init?: ITrackingOrderForm) {
    Object.assign(this, init);
  }
}
