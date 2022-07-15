import moment from "moment";

export interface IReportList {
  id: string;
  ciudadId: string;
  expedienteNombre: string;
  sucursalId: string;
  expediente: string;
  pacienteNombre: string;
  visitas: number;
  fecha: Date;
  fechaInicial: Date;
  fechaFinal: Date;
  grafica: boolean;
}
export interface IReportTable {
  id: string;
  expedienteNombre: string;
  nombrePaciente: string;
  sucursalId?: string;
  visitas: number;
}
export interface IReportForm {
  id: string;
  ciudadId?: string;
  sucursalId?: string;
  grafica?: boolean;
  fechaInicial?: Date;
  fechaFinal?: Date;
  sucursal: string;
  fecha: moment.Moment[];
}
export class ReportFormValues implements IReportForm {
  id = "";
  ciudadId = "";
  sucursalId = "";
  grafica = false;
  sucursal = "";
  fecha = [moment(Date.now()), moment(Date.now()).add("day", 1)];

  constructor(init?: IReportForm) {
    Object.assign(this, init);
  }
}
