import moment from "moment";

export interface IReportList {
  id: string;
  ciudadId: string;
  clave: string;
  sucursalId: string;
  expediente: string;
  nombre: string;
  visitas: number;
  fechaInicial: Date;
  fechaFinal: Date;
  grafica: boolean;
}
export interface IReportTable{
  id: string;
  nombre: string;
  clave: string;
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
   fecha: moment.Moment[];
}
export class ReportFormValues implements IReportForm {
  id = "";
  ciudadId = "";
  sucursalId = "";
  grafica = false;
  fecha = [moment(Date.now()), moment(Date.now()).add("day", 1)];

  constructor(init?: IReportForm) {
    Object.assign(this, init);
  }
}
