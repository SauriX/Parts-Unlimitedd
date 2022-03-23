export interface IUserInfo {
  id: number;
  clave: string;
  nombre: string;
  tipoUsuario: string;
  activo: boolean;
}

export interface IUser {
  id: number;
  clave: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  rolId?: number;
  contraseña?: string;
  contraseñaConfirmacion?: string;
  activo: boolean;
  sucursalId?: number;
  permisos?: IUserPermission[];
}

export interface IUserPermission {
  id: number;
  menuId: number;
  menu: string;
  permiso: string;
  asignado: boolean;
  tipo: number;
}

export class UserFormValues implements IUser {
  id = 0;
  clave = "";
  nombre = "";
  primerApellido = "";
  segundoApellido = "";
  activo = true;

  constructor(init?: IUser) {
    Object.assign(this, init);
  }
}
