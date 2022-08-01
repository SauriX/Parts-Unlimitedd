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
  totalEstudios: number;
  totals: ICompanyInvoice[];
}

export interface IStudiesData {
  id: string;
  clave: string;
  estudio: string;
  estatus: string;
  precio: number;
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

export interface ICompanyInvoice {
  sumaEstudios: number;
  sumaDescuentos: number;
  sumaDescuentosPorcentual: number;
  subtotal: number;
  iva: number;
  total: number;
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
