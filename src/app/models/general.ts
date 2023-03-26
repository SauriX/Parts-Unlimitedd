import moment from "moment";

export interface IGeneralForm {
  // Captura de resultados, Toma de muestra, Solicitud de estudio, Reporte del dia, Validacion y liberacion de resultados
  sucursalId?: string[];
  medicoId?: string[];
  compañiaId?: string[];
  fecha?: moment.Moment[];
  buscar?: string;
  procedencia?: number[];
  area?: number[];
  departamento?: string[];
  ciudad?: string[];
  tipoSolicitud?: string[];
  estatus?: number[];
  estudio?: number[];
  // Expediente
  expediente?: string;
  telefono?: string;
  fechaNacimiento?: moment.Moment;
  correo?: string;
  fechaNInicial?: moment.Moment;
  fechaNFinal?: moment.Moment;
  // Solicitudes
  tipoFecha?: number;
  // Envio resultados
  mediosEntrega?: number[];
  // Tabla captura
  nombreArea?: string;
}

export class GeneralFormValues implements IGeneralForm {
  medicoId = [];
  compañiaId = [];
  fecha = [moment().utcOffset(0, true), moment().utcOffset(0, true)];
  buscar = "";
  procedencia = [];
  departamento = [];
  tipoSolicitud = [];
  estatus = [];
  estudio = [];
  expediente = "";
  telefono = "";
  correo = "";
  tipoFecha = 1;
  mediosEntrega = [];
  nombreArea = "";

  constructor(init?: IGeneralForm) {
    Object.assign(this, init);
  }
}
