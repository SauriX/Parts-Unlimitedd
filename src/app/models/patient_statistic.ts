import moment from "moment";

export interface IPatientStatisticList {
  id: string;
  ciudadId: string;
  sucursalId: string;
  nombrePaciente: string;
  sucursal: string;
  solicitudes: string;
  total: string;
  fecha: Date;
  grafica: boolean;
}

export interface IPatientStatisticTable {
  id: string;
  nombrePaciente: string;
  solicitudes: string;
  sucursalId?: string;
  total: string;
}

export interface IPatientStatisticForm {
  id: string;
  ciudadId?: string;
  sucursalId?: string;
  grafica?: boolean;
  fechaInicial?: Date;
  fechaFinal?: Date;
  sucursal: string;
  fecha: moment.Moment[];
}

export class PatientStatisticFormValues implements IPatientStatisticForm {
  id = "";
  ciudadId = "";
  sucursalId = "";
  grafica = false;
  sucursal = "";
  fecha = [moment(Date.now()), moment(Date.now()).add("day", 1)];

  constructor(init?: IPatientStatisticForm) {
    Object.assign(this, init);
  }
}
