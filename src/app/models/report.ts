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
  promocion: number;
  subtotal: number;
  iva: number;
  totalEstudios: number;
  cargo: number;
  cargoPorcentual: number;
  subtotalCargo: number;
  ivaCargo: number;
  totalCargo: number;
  claveEstudio: string;
  nombreEstudio: string;
  maquila: string;
}

export interface IStudiesData {
  id: string;
  clave: string;
  estudio: string;
  estatus: string;
  paquete?: string;
  promocion?: number;
  descuento?: number;
  precio?: number;
  precioFinal?: number;
  total?: number;
  maquila?: string;
  sucursal?: string;
}

export interface InvoiceData {
  key: string;
  totalEstudios: number;
  totalDescuentoPorcentual: number;
  totalDescuentos: number;
  subtotal: number;
  iva: number;
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

export interface IMaquilaData {
  id: string;
  maquila: string;
  noSolicitudes: number;
}

export interface IBudgetData {
  id: string;
  sucursal: string;
  fecha: string;
  total: number;
}

export interface IReportFilter {
  sucursalId: string[];
  ciudad: string[];
  medicoId: string[];
  compañiaId: string[];
  metodoEnvio: number[];
  tipoCompañia: number[];
  urgencia: number[];
  fecha: moment.Moment[];
  grafica: boolean;
  cargaInicial?: boolean;
}

export class ReportFilterValues implements IReportFilter {
  sucursalId = [];
  ciudad = [];
  medicoId = [];
  compañiaId = [];
  metodoEnvio = [];
  tipoCompañia = [];
  urgencia = [];
  fecha = [moment(Date.now()).utcOffset(0, true), moment(Date.now()).utcOffset(0, true)];
  grafica = false;
  cargaInicial = true;

  constructor(init?: IReportFilter) {
    Object.assign(this, init);
  }
}
