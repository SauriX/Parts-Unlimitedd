import moment, { Moment } from "moment";
import { ITaxData } from "./taxdata";

export interface IProceedingList {
  id: string;
  expediente: string;
  nomprePaciente: string;
  genero: string;
  edad: number;
  fechaNacimiento: string;
  sucursal: string;
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
  edad?: number | string;
  edadCheck: boolean;
  telefono: string;
  correo: string;
  cp: string;
  estado: string;
  municipio: string;
  celular: string;
  calle: string;
  colonia?: number | string | null;
  colonian?: string;
  taxData?: ITaxData[];
  sucursal?: string;

  hasWallet: boolean;
  wallet: number;
  fechaActivacionMonedero?: Date;

  observaciones?: string;
}

export class ProceedingFormValues implements IProceedingForm {
  id = "";
  nombre = "";
  apellido = "";
  expediente = "";
  sexo = "";
  fechaNacimiento = new Date(moment.now());
  edad = undefined;
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
  observaciones = "";
  constructor(init?: IProceedingForm) {
    Object.assign(this, init);
  }
}
