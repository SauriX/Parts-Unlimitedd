import moment from "moment";

export interface IGeneralForm {
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
  expediente?: string;
  telefono?: string;
  fechaNacimiento?: moment.Moment;
  correo?: string;
  fechaNInicial?: moment.Moment;
  fechaNFinal?: moment.Moment;
  tipoFecha?: number;
  mediosEntrega?: number[];
  nombreArea?: string;
  cargaInicial?: boolean;
}

export class GeneralFormValues implements IGeneralForm {
  medicoId = [];
  compañiaId = [];
  sucursalId = [];
  ciudad = [];
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
  cargaInicial = true;

  constructor(init?: IGeneralForm) {
    Object.assign(this, init);
  }
}
