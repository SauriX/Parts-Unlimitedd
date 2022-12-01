import { IDepartamenList } from "./departament";
export interface IBranchForm {
  idSucursal: string;
  clave: string;
  nombre: string;
  calle: string;
  correo: string;
  telefono?: number;
  numeroExt?: number;
  numeroInt?: number;
  presupuestosId: string;
  facturaciónId: string;
  clinicosId: string;
  activo: boolean;
  estado: string;
  ciudad: string;
  coloniaId?: number;
  codigoPostal: string;
  departamentos: IBranchDepartment[];
  matriz?: boolean;
}

export interface IBranchCity {
  sucursales: IBranchInfo[];
  ciudad: string;
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
  ciudad: string;
  codigo: string;
}

export interface IBranchDepartment {
  departamentoId: number;
  departamento: string;
}

export class BranchFormValues implements IBranchForm {
  idSucursal = "";
  clave = "";
  nombre = "";
  calle = "";
  correo = "";
  telefono = undefined;
  presupuestosId = "";
  facturaciónId = "";
  clinicosId = "";
  servicioId = "";
  activo = true;
  estado = "";
  ciudad = "";
  coloniaId = undefined;
  codigoPostal = "";
  numeroInt = undefined;
  numeroExt = undefined;
  departamentos: IBranchDepartment[] = [];
  constructor(init?: IBranchForm) {
    Object.assign(this, init);
  }
}
