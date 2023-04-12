import moment from "moment";

export interface IShipmentStudies {
  id: string;
  estudio: string;
  paciente: string;
  solicitud: string;
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
  estudios: IShipmentStudies[];
  seguimiento: string;
  ruta: string;
  nombre: string;
}
