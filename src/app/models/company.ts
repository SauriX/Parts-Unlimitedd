import { IContactForm } from "./contact";

export interface ICompanyList {
  id: string;
  clave: string;
  contrasena: string;
  nombreComercial: string;
  procedenciaId: number;
  precioLista: string;
  activo: boolean;
}

export interface ICompanyForm {
  id: string;
  clave: string;
  contrasena: string;
  nombreComercial: string;
  emailEmpresarial: string;
  procedenciaId?: number;
  precioListaId: string | null | undefined;
  promocionesId?: number;
  rfc: string;
  codigoPostal: string;
  estado: string;
  ciudad: string;
  razonSocial: string;
  coloniaId: number;
  colonia: string | null | undefined;
  regimenFiscal: string;
  metodoDePagoId?: number;
  formaDePagoId?: number;
  limiteDeCredito: string;
  diasCredito?: number;
  cfdiId?: number;
  numeroDeCuenta: string;
  bancoId?: number;
  activo: boolean;
  contacts: IContactForm[];
}
export class CompanyFormValues implements ICompanyForm {
  id = "";
  clave = "";
  contrasena = "";
  nombreComercial = "";
  emailEmpresarial = "";
  procedenciaId = undefined;
  precioListaId = null;
  promocionesId = 0;
  rfc = "";
  codigoPostal = "";
  estado = "";
  ciudad = "";
  razonSocial = "";
  metodoDePagoId = undefined;
  formaDePagoId = undefined;
  limiteDeCredito = "";
  diasCredito = undefined;
  cfdiId = undefined;
  numeroDeCuenta = "";
  bancoId = undefined;
  activo = true;
  contacts: IContactForm[] = [];
  coloniaId = 0;
  colonia = "";
  regimenFiscal = "";

  constructor(init?: ICompanyForm) {
    Object.assign(this, init);
  }
}
