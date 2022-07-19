import moment from "moment";

export interface IMedicalStatsList {
  id: string;
  ciudadId: string;
  sucursalId: string;
  nombreMedico: string;
  claveMedico: string;
  sucursal: string;
  solicitudes: string;
  pacientes: string;
  total: string;
  fecha: Date;
  grafica: boolean;
}

export interface IMedicalStatsTable {
  id: string;
  claveMedico: string;
  nombreMedico: string;
  solicitudes: string;
  pacientes: string;
  sucursalId?: string;
  total: string;
}

export interface IMedicalStatsForm {
  id: string;
  ciudadId?: string;
  sucursalId?: string[];
  grafica?: boolean;
  fechaInicial?: Date;
  fechaFinal?: Date;
  sucursal: string;
  medicoId?: string;
  nombreMedico: string;
  fecha: moment.Moment[];
}

export class MedicalStatsFormValues implements IMedicalStatsForm {
  id = "";
  ciudadId = "";
  sucursalId = [];
  grafica = false;
  sucursal = "";
  medicoId = "";
  nombreMedico = "";
  fecha = [moment(Date.now()), moment(Date.now()).add("day", 1)];

  constructor(init?: IMedicalStatsForm) {
    Object.assign(this, init);
  }
}
