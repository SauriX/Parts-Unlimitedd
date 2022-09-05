import moment from "moment";

export interface IsamplingForm {
  fecha?: moment.Moment[];
  buscar: string;
  procedencia: number[];
  departamento: number[];
  ciudad: string[];
  tipoSolicitud: string[];
  area: number[];
  sucursal: string[];
  status: number[];
  medico: string[];
  compañia: string[];
}
export interface IsamplingList {
  id: string;
  solicitud: string;
  nombre: string;
  order: string;
  registro: string;
  sucursal: string;
  edad: string;
  sexo: string;
  compañia: string;
  seleccion: boolean;
  estudios: IstudySampling[];
}
export interface IstudySampling {
  id: number;
  nombre: string;
  area: string;
  status: number;
  registro: string;
  entrega: string;
  seleccion: boolean;
  clave: string;
}
export interface IUpdate {
  id: number[];
}
export class samplingFormValues implements IsamplingForm {
  fecha = [moment(moment.now()), moment(moment.now())];
  buscar = "";
  procedencia = [];
  departamento = [];
  ciudad = [];
  tipoSolicitud = [];
  area = [];
  sucursal = [];
  status = [];
  medico = [];
  compañia = [];

  constructor(init?: IsamplingForm) {
    Object.assign(this, init);
  }
}
