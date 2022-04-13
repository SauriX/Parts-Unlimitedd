export interface IBranchForm {
  estado: string;
  ciudad: string;
  coloniaId: number;
  codigoPostal: string;
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
}
