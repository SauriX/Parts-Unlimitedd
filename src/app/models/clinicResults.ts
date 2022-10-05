import moment from "moment";
import { IParameterList } from "./parameter";

export interface IClinicResultList {
  id: string;
  expedienteId: string;
  solicitud: string;
  nombre: string;
  order: string;
  registro: string;
  sucursal: string;
  sucursalNombre: string;
  nombreMedico: string;
  usuarioCreo: string;
  edad: string;
  sexo: string;
  compañia: string;
  seleccion: boolean;
  estudios: IClinicStudy[];
  procedencia: number;
}
export interface IResultPathological {
  id?: string;
  solicitudId: string;
  estudioId: number;
  requestStudyId: number;
  descripcionMacroscopica: string;
  descripcionMicroscopica: string;
  imagenPatologica?: any;
  diagnostico: string;
  muestraRecibida: string;
  medicoId: string;
  listaImagenesCargadas: string[];
}

export interface IClinicStudy {
  estudioId: number;
  nombre: string;
  areaId: number;
  area?: string;
  status?: number;
  registro?: string;
  entrega?: string;
  seleccion?: boolean;
  clave: string;
  estatusId: number;
  estatus?: string;
  resultado?: string;
}

export interface IClinicResultForm {
  sucursalId: string[];
  medicoId: string[];
  compañiaId: string[];
  fecha: moment.Moment[];
  buscar: string;
  procedencia: number[];
  departamento: number[];
  area: number[];
  tipoSolicitud: string[];
  estatus: number[];
  estudio: number[];
}

export interface IStudyList {
  id: number;
  nombre: string;
  area: string;
  status: number;
  registro: string;
  entrega: string;
  seleccion: boolean;
  clave: string;
  parametros: IParameterList[];
  resultado: string;
}

export class ResultPathologicalValues implements IResultPathological {
  id? = "";
  solicitudId = "";
  estudioId = 0;
  requestStudyId = 0;
  descripcionMacroscopica = "";
  descripcionMicroscopica = "";
  imagenPatologica? = "";
  diagnostico = "";
  muestraRecibida = "";
  medicoId = "";
  listaImagenesCargadas = [];
  constructor(init?: IClinicResultForm) {
    Object.assign(this, init);
  }
}

export class ClinicResultsFormValues implements IClinicResultForm {
  sucursalId = [];
  medicoId = [];
  compañiaId = [];
  fecha = [
    moment(Date.now()).utcOffset(0, true),
    moment(Date.now()).utcOffset(0, true).add(1, "day"),
  ];
  buscar = "";
  procedencia = [];
  departamento = [];
  tipoSolicitud = [];
  area = [];
  estatus = [];
  estudio = [];

  constructor(init?: IClinicResultForm) {
    Object.assign(this, init);
  }
}
