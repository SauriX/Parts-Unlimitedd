import { IContactList } from "./contact";

export interface ICompanyList {
  idCompania: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    procedencia : number;
    listaPrecioId: number;
    activo: boolean;
  }

  
export interface ICompanyForm {
  idCompania: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    emailEmpresarial : string
    procedencia : number;
    listaPrecioId?: number;
    promocionesId?: number;
    rFC: string;
    codigoPostal: string;
    estado: string;
    ciudad: string;
    razonSocial: string;
    metodoDePagoId: number;
    formaDePagoId?: number;
    limiteDeCredito: string;
    diasCredito?: number;
    cFDIId?: number;
    numeroDeCuenta: string;
    bancoId?: number;
    activo: boolean;
    contacts: IContactList[];
  }
  export class CompanyFormValues implements ICompanyForm {
   
    idCompania= 0;
    clave= "";
    contrasena = "";
    nombreComercial= "";
    emailEmpresarial = "";
    procedencia= 0;
    listaPrecioId= undefined;
    promocionesId= undefined;
    rFC= "";
    codigoPostal= "";
    estado= "";
    ciudad= "";
    razonSocial= "";
    metodoDePagoId= 0;
    formaDePagoId= undefined;
    limiteDeCredito= "";
    diasCredito= undefined;
    cFDIId= undefined;
    numeroDeCuenta= "";
    bancoId= undefined;
    activo= true;
    contacts: IContactList[] = [];
  
    constructor(init?: ICompanyForm) {
      Object.assign(this, init);
    }
  }