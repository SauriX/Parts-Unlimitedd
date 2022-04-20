import { IContactList } from "./contact";

export interface ICompanyList {
    id: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    emailEmpresarial : string
    Procedencia : string
    ListaPrecioId: number;
    PromocionesId: number;
    RFC: string;
    CodigoPostal: number;
    EstadoId: number;
    MunicipioId: number;
    RazonSocial: string;
    MetodoDePagoId: number;
    FormaDePagoId: number;
    LimiteDeCredito: string;
    DiasCredito: number;
    CFDIId: number;
    NumeroDeCuenta: string;
    BancoId: number;
    activo: boolean;
    contact: IContactList[];
  }

  
export interface ICompanyForm {
    id: number;
    clave: string;
    contrasena : string;
    nombreComercial: string;
    emailEmpresarial : string
    Procedencia : string
    ListaPrecioId?: number;
    PromocionesId?: number;
    RFC: string;
    CodigoPostal?: number;
    EstadoId?: number;
    MunicipioId?: number;
    RazonSocial: string;
    MetodoDePagoId: number;
    FormaDePagoId?: number;
    LimiteDeCredito: string;
    DiasCredito?: number;
    CFDIId?: number;
    NumeroDeCuenta: string;
    BancoId?: number;
    activo: boolean;
    contact: IContactList[];
  }
  export class CompanyFormValues implements ICompanyForm {
   
    id= 0;
    clave= "";
    contrasena = "";
    nombreComercial= "";
    emailEmpresarial = "";
    Procedencia= "";
    ListaPrecioId= undefined;
    PromocionesId= undefined;
    RFC= "";
    CodigoPostal= undefined;
    EstadoId= undefined;
    MunicipioId= undefined;
    RazonSocial= "";
    MetodoDePagoId= 0;
    FormaDePagoId= undefined;
    LimiteDeCredito= "";
    DiasCredito= undefined;
    CFDIId= undefined;
    NumeroDeCuenta= "";
    BancoId= undefined;
    activo= true;
    contact: IContactList[] = [];
  
    constructor(init?: ICompanyForm) {
      Object.assign(this, init);
    }
  }