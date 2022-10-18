import moment from "moment";

export interface IWorkList {
  id: number;
  clave: string;
  nombre: string;
  activo: boolean;
}

export interface IWorkListFilter {
  area?: number;
  fecha: moment.Moment;
  horaInicio?: moment.Moment;
  horaFin?: moment.Moment;
  hora: moment.Moment[];
  sucursales: string[];
}

export class WorkListFilterFormValues implements IWorkListFilter {
  area?: number;
  fecha: moment.Moment = moment();
  horaInicio?: moment.Moment;
  horaFin?: moment.Moment;
  hora: moment.Moment[] = [
    moment("01/01/2022 00:00", "DD/MM/YYYY HH:mm"),
    moment("01/01/2022 23:59", "DD/MM/YYYY HH:mm"),
  ];
  sucursales: string[] = [];

  constructor(init?: IWorkListFilter) {
    Object.assign(this, init);
  }
}
