import moment from "moment";

export interface IPatientStatisticList {
    id: string;
    ciudadId: string;
    clave: string;
    sucursalId: string;
    nombre: string;
    solicitado: string;
    monto: string;
    fecha: Date;
    fechaInicial: Date;
    fechaFinal: Date;
    grafica: boolean;
}

export interface IPatientStatisticTable {
    id: string;
    nombre: string;
    solicitado: string;
    sucursalId?: string;
    monto: string;
}

export interface IPatientStatisticForm {
    id: string;
    ciudadId?: string;
    sucursalId?: string;
    grafica?: boolean;
    fechaInicial?: Date;
    fechaFinal?: Date;
    fecha: moment.Moment[];
}

export class PatientStatisticFormValues implements IPatientStatisticForm {
    id = "";
    ciudadId = "";
    sucursalId = "";
    grafica = false;
    fecha = [moment(Date.now()), moment(Date.now()).add("day", 1)];
  
    constructor(init?: IPatientStatisticForm) {
      Object.assign(this, init);
    }
}
