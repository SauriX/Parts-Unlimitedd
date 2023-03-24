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
  fechaAlta?: moment.Moment[];
  // Cotizacion 
  fechaAInicial?: moment.Moment;
  fechaAFinal?: moment.Moment;
  correo?: string;
  fechaNInicial?: moment.Moment;
  fechaNFinal?: moment.Moment;
  // Solicitudes
  tipoFecha?: number;
  fechaInicial?: moment.Moment;
  fechaFinal?: moment.Moment;
  // Envio resultados
  mediosEntrega?: number[];
  // Tabla captura
  nombreArea?: string;
}

export class GeneralFormValues implements IGeneralForm {
  sucursalId = [];
  medicoId = [];
  compañiaId = [];
  fecha = [moment(moment.now()), moment(moment.now())];
  buscar = '';
  procedencia = [];
  area = [];
  departamento = [];
  ciudad = [];
  tipoSolicitud = [];
  estatus = [];
  estudio = [];
  expediente = '';
  telefono = '';
  fechaNacimiento = moment(moment.now());
  fechaAlta = [moment(moment.now()), moment(moment.now())];
  fechaAInicial = moment(moment.now());
  fechaAFinal = moment(moment.now());
  correo = '';
  fechaNInicial = moment(moment.now());
  fechaNFinal = moment(moment.now());
  tipoFecha = 0;
  fechaInicial = moment(moment.now());
  fechaFinal = moment(moment.now());
  mediosEntrega = [];
  nombreArea = '';

  constructor(init?: IGeneralForm) {
    Object.assign(this, init);
  }
}
