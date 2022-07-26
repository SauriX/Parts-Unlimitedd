import moment from "moment";

export interface IReportData {
  id: string;
  expediente: string;
  sucursal: string;
  paciente: string;
  medico: string;
  clave: string;
  claveMedico: string;
  noSolicitudes: number;
  estatus: string;
  fecha: Date;
  total: number;
  noPacientes: number;
  celular: string;
  correo: string;
}

export interface IReportContactData {
  id: string;
  fecha: string;
  cantidadTelefono: number;
  cantidadCorreo: number;
  solicitudes: number;
  total: number;
}

export interface IReportFilter {
  sucursalId: string[];
  medicoId: string[];
  compañiaId: string[];
  metodoEnvio: number[];
  fecha: moment.Moment[];
  grafica: boolean;
}

export class ReportFilterValues implements IReportFilter {
  sucursalId = [];
  medicoId = [];
  compañiaId = [];
  metodoEnvio = [];
  fecha = [moment(Date.now()), moment(Date.now()).add(1, "day")];
  grafica = false;

  constructor(init?: IReportFilter) {
    Object.assign(this, init);
  }
}
