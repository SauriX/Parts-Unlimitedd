import { uniqueId } from "lodash";
import moment from "moment";

export interface IEstudiosList {
  taponNombre: string;
  estudio?: ITrackingOrderList;
  escaneado: boolean;
  temperatura: number;
  solicitud: string;
  nombrePaciente: string;
  id?: string;
  solicitudId: string;
  IsInRute?: boolean;
}

export interface searchstudies {

estudios:number[];
solicitud :string;
}
export interface IRequestStudyOrder {
  id:number;
  clave:string;
  estudio:string;
  estatus:string;
  dias:string;
  fecha:string;
  estatusId:number;
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
  id?: string;
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
  isInRute: boolean;
  estudiosAgrupados?: IEstudiosList[];
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
  isInRute = false;
  constructor(init?: ITrackingOrderForm) {
    Object.assign(this, init);
  }
}
