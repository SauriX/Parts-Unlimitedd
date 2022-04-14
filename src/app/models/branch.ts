import { IStudyList } from "./study";
export interface IBranchForm {
  IdSucursal:string;
  Clave:string;
  Nombre:string; 
  Calle:string;
  Correo:string;
  Telefono:number;
  NumeroExt:number;
  NumeroInt:number;
  PresupuestosId:string;
  FacturaciónId:string;
  ClinicosId:string;
  Activo:boolean;
  estado:string;
  ciudad:string;
  coloniaId:number;
  codigoPostal:string;
  estudios:IStudyList[];
}

export interface IBranchInfo {
  idSucursal: string;
  clave: string;
  nombre: string;
  correo: string;
  telefono: Number;
  ubicacion: string;
  clinico: string;
  activo: boolean;
  codigoPostal: string;
}

export class BranchFormValues implements IBranchForm {
  IdSucursal="";
  Clave="";
  Nombre=""; 
  Calle="";
  Correo="";
  Telefono=0;
  PresupuestosId="";
  FacturaciónId="";
  ClinicosId="";
  ServicioId="";
  Activo=false;
  estado="";
  ciudad="";
  coloniaId=0;
  codigoPostal="";
  estudios=[];
  NumeroInt =0;
  NumeroExt=0;

  constructor(init?: IBranchForm) {
    Object.assign(this, init);
  }
}