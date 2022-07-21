import moment from "moment";

export interface IReportData {
  id: string;
  expediente: string;
  sucursal: string;
  paciente: string;
  medico: string;
  claveMedico: string;
  noSolicitudes: string;
  fecha: Date;
  total: string;
  noPacientes: string;
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
