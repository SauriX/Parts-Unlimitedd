export interface IConfigurationEmail {
  correo: string;
  remitente: string;
  smtp: string;
  requiereContraseña: boolean;
  contraseña?: string;
}

export interface IConfigurationGeneral {
  nombreSistema: string;
  logoRuta: string;
  logo?: File;
}

export interface IConfigurationFiscal {
  rfc: string;
  razonSocial: string;
  codigoPostal: string;
  estado: string;
  ciudad: string;
  colonia: string;
  calle: string;
  numero: string;
  telefono?: string;
  correo?: string;
  webSite?: string;
}
