import moment from "moment";

export interface IReportData {
  id: string;
  expediente: string;
  sucursal: string;
  paciente: string;
  medico: string;
  solicitud: string;
  estudio: IStudiesData[];
  edad: number;
  sexo: string;
  claveMedico: string;
  noSolicitudes: number;
  estatus: string;
  fecha: Date;
  fechaEntrega: Date;
  total: number;
  noPacientes: number;
  celular: string;
  correo: string;
  parcialidad: boolean;
  urgencia: number;
  empresa: string;
  convenio: number;
  precioEstudios: number;
  descuento: number;
  descuentoPorcentual: number;
  subtotal: number;
  iva: number;
  totalEstudios: number;
  cargo: number;
  cargoPorcentual: number;
  subtotalCargo: number;
  ivaCargo: number;
  totalCargo: number;
}

export interface IStudiesData {
  id: string;
  clave: string;
  estudio: string;
  paquete: string;
  estatus: string;
  precio: number;
  precioFinal: number;
  total: number;
}
export interface IReportRequestData {
  id: string;
  sucursal: string;
  cantidad: number;
}
export interface IReportContactData {
  id: string;
  fecha: string;
  cantidadTelefono: number;
  cantidadCorreo: number;
  solicitudes: number;
  total: number;
}

export interface IReportStudyData {
  id: string;
  estatus: string;
  cantidad: number;
  color: string;
}

export interface IReportCompanyData {
  id: string;
  compañia: string;
  noSolicitudes: number;
}

export interface IMedicalBreakdownData {
  id: string;
  claveMedico: string;
  noSolicitudes: number;
}

export interface IReportFilter {
  sucursalId: string[];
  medicoId: string[];
  compañiaId: string[];
  metodoEnvio: number[];
  tipoCompañia: number[];
  urgencia: number[];
  fecha: moment.Moment[];
  grafica: boolean;
}

export class ReportFilterValues implements IReportFilter {
  sucursalId = [];
  medicoId = [];
  compañiaId = [];
  metodoEnvio = [];
  tipoCompañia = [];
  urgencia = [];
  fecha = [moment(Date.now()), moment(Date.now()).add(1, "day")];
  grafica = false;

  constructor(init?: IReportFilter) {
    Object.assign(this, init);
  }
}
