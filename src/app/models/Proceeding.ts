import moment, { Moment } from "moment";
import { ITaxData } from "./taxdata";
export interface ISearchMedical {
  expediente: string;
  telefono: string;
  fechaNacimiento?:  moment.Moment;
  fechaAlta?: moment.Moment[];
  ciudad: string;
  sucursal: string;
}
export interface IProceedingList {
  id: string;
  expediente: string;
  nomprePaciente: string;
  genero: string;
  edad: number;
  fechaNacimiento: string;
  monederoElectronico: number;
  telefono: string;
}

export interface IProceedingForm {
  id: string;
  nombre: string;
  apellido: string;
  expediente: string;
  sexo: string;
  fechaNacimiento?: Date | moment.Moment;
  fechaNacimientoFormat?: string;
  edad: number;
  edadCheck: boolean;
  telefono: string;
  correo: string;
  cp: string;
  estado: string;
  municipio: string;
  celular: string;
  calle: string;
  colonia?: number | string;
  colonian?: string;
  taxData?: ITaxData[];
  sucursal?: string;

  hasWallet: boolean;
  wallet: number;
  fechaActivacionMonedero?: Date;
}

export class SearchMedicalFormValues implements ISearchMedical {
  expediente = "";
  telefono = "";
  fechaNacimiento = moment();
  fechaAlta = [moment(),moment()];
  ciudad = "";
  sucursal = "";

  constructor(init?: ISearchMedical) {
    Object.assign(this, init);
  }
}

export class ProceedingFormValues implements IProceedingForm {
  id = "";
  nombre = "";
  apellido = "";
  expediente = "";
  sexo = "";
  fechaNacimiento = new Date(moment.now());
  edad = 0;
  edadCheck = false;
  telefono = "";
  correo = "";
  cp = "";
  estado = "";
  municipio = "";
  celular = "";
  calle = "";
  colonia = undefined;

  hasWallet = false;
  wallet = 0;
  constructor(init?: IProceedingForm) {
    Object.assign(this, init);
  }
}
