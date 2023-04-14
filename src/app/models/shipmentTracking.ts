import moment from "moment";

export interface IShipmentTags {
  id: string;
  claveEtiqueta: string;
  recipiente: string;
  cantidad: number;
  estudios: string;
  solicitud: string;
  estatus: number;
  paciente: string;
  confirmacionOrigen: boolean;
  confirmacionDestino: boolean;
}

export interface IShipmentTracking {
  id: string;
  origen: string;
  destino: string;
  emisor: string;
  receptor: string;
  paqueteria: string;
  fechaEnvio: moment.Moment;
  fechaEstimada: moment.Moment;
  fechaReal: moment.Moment;
  estudios: IShipmentTags[];
  seguimiento: string;
  ruta: string;
  nombre: string;
  activo: boolean;
}
