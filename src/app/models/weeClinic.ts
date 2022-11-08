import moment from "moment";

export interface IWeeLabFolioInfo {
  idOrden: string;
  folioOrden: string;
  dateInsert: string;
  fechaFolio: string;
  idProducto: string;
  corporativoNombre: string;
  productoNombre: string;
  noPoliza: string;
  idPersona: string;
  nombre: string;
  paterno: string;
  materno: string;
  nombreCompleto: string;
  curp: string;
  codGenero: string;
  genero: string;
  rfc: string;
  edad: string;
  fechaNacimiento: Date;
  correo: string;
  telefono: string;
  tpa: string;
  isEstatus: string;
  copagos: string;
  isTyC: string;
  nombreCompleto_Medico: string;
  estatusVigencia: string;
  estudios: IWeePatientInfoStudy[];
}

export interface IWeePatientInfoStudy {
  idServicio: string;
  idNodo: string;
  clave: string;
  nombre: string;
  descripcionWeeClinic: string;
  cantidad: number;
}
