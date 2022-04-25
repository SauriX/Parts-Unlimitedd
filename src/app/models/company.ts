import { IContactForm, IContactList } from "./contact";

export interface ICompanyList {
  id: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    procedencia : number;
    listaPrecioId: number;
    activo: boolean;
  }

  
export interface ICompanyForm {
  id: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    emailEmpresarial : string
    procedencia : number;
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
    procedencia= 0;
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

  export interface IProcedenciaList {
    id: number;
    nombre: string;
    Clave: string;
    activo: boolean;
  }
  
  export interface IProcedenciaForm {
    id: number;
    nombre: string;
    Clave: string;
    usuarioId: number;
    activo: boolean;
  }
  
  export class ProcedenciaFormValues implements IProcedenciaForm {
    id = 0;
    nombre = "";
    Clave= "";
    usuarioId = 0;
    activo = true;
  
    constructor(init?: IProcedenciaForm) {
      Object.assign(this, init);
    }
  }
  