import { uniqueId } from "lodash";
import moment from "moment";

export interface IStudyTrackList {
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
  isExtra?: boolean;
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
  estudiosAgrupados?: IStudyTrackList[];
  estudios: ITrackingOrderList[];
  horaDeRecoleccion: number | undefined;
  fecha: moment.Moment;
  solicitudId: string;
  claveEstudio: string;
  estudio: string;
  pacienteId: string;
  escaneado: boolean;
}
export class TrackingOrderListValues implements IStudyTrackList {
  claveEtiqueta = "";
  recipiente = "";
  cantidad = 0;
  estudios = "";
  solicitud = "";
  ruta = "";
  estatus = "";
  escaneo = false;

  constructor(init?: IStudyTrackList) {
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
