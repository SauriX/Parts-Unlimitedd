import moment from "moment";

export interface ITrackingOrderList {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  dias?: number;
}

export interface ITrackingOrderForm {
  id: number;
  fecha: moment.Moment;
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
}

export class TrackingOrderFormValues implements ITrackingOrderForm {
  id = 0;
  fecha = moment();
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

  constructor(init?: ITrackingOrderForm) {
    Object.assign(this, init);
  }
}
