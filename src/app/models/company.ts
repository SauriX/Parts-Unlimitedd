import { IContactForm, IContactList } from "./contact";

export interface ICompanyList {
  id: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    procedenciaid : number;
    listaPrecioId: number;
    activo: boolean;
  }

  
export interface ICompanyForm {
  id: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    emailEmpresarial : string
    procedenciaId : number;
    listaPrecioId?: number;
    promocionesId?: number;
    rfc: string;
    codigoPostal: string;
    estado: string;
    ciudad: string;
    razonSocial: string;
    metodoDePagoId: number;
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
   
    id= 0;
    clave= "";
    contrasena = "";
    nombreComercial= "";
    emailEmpresarial = "";
    procedenciaId= 0;
    listaPrecioId= undefined;
    promocionesId= undefined;
    rfc= "";
    codigoPostal= "";
    estado= "";
    ciudad= "";
    razonSocial= "";
    metodoDePagoId= 0;
    formaDePagoId= undefined;
    limiteDeCredito= "";
    diasCredito= undefined;
    cfdiId= undefined;
    numeroDeCuenta= "";
    bancoId= undefined;
    activo= true;
    contacts: IContactForm[] = [];
  
    constructor(init?: ICompanyForm) {
      Object.assign(this, init);
    }
  }

  