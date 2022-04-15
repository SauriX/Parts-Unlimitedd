import { IStudyList } from "./study";
export interface IBranchForm {
  idSucursal:string;
  clave:string;
  nombre:string; 
  calle:string;
  correo:string;
  telefono:number;
  numeroExt:number;
  numeroInt:number;
  presupuestosId:string;
  facturaciónId:string;
  clinicosId:string;
  activo:boolean;
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
  idSucursal="";
  clave="";
  nombre=""; 
  calle="";
  correo="";
  telefono=0;
  presupuestosId="";
  facturaciónId="";
  clinicosId="";
  servicioId="";
  activo=false;
  estado="";
  ciudad="";
  coloniaId=0;
  codigoPostal="";
  estudios=[];
  numeroInt =0;
  numeroExt=0;

  constructor(init?: IBranchForm) {
    Object.assign(this, init);
  }
}