export interface IUserList {
  id: string;
  clave: string;
  nombre: string;
  tipoUsuario: string;
  activo: boolean;
}

export interface ILoginForm {
  usuario: string;
  contraseña: string;
}

export interface ILoginResponse {
  token: string;
  changePassword: boolean;
  id: string;
  code: Number;
}
export interface IChangePasswordForm {
  token: string;
  contraseña: string;
  confirmaContraseña: string;
}
export interface IUserPermission {
  id: number;
  menuId: number;
  menu: string;
  permiso: string;
  asignado: boolean;
  tipo: number;
}
export interface IClave {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
}
export interface IChangePasswordResponse {
  idUsuario: string;
  clave: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  idRol: string;
  idSucursal: Number;
  contraseña: string;
  activo: boolean;
  usuarioCreoId: string;
  fechaCreo: string;
  usuarioModId: string;
  fechaMod: string;
  flagpassword: true;
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: true;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string;
  lockoutEnabled: boolean;
  accessFailedCount: Number;
}
export interface IUserForm {
  id: string;
  clave: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  sucursalId?: number;
  rolId?: string;
  contraseña: string;
  confirmaContraseña: string;
  activo: boolean;
  permisos?: IUserPermission[];
  sucursales?: string[];
  images: string[];
}
export class UserFormValues implements IUserForm {
  id = "";
  clave = "";
  nombre = "";
  primerApellido = "";
  segundoApellido = "";
  sucursalId = undefined;
  rolId = undefined;
  contraseña = "";
  confirmaContraseña = "";
  activo = true;
  images = [];
  constructor(init?: IUserForm) {
    Object.assign(this, init);
  }
}

export class claveValues implements IClave {
  nombre = "";
  primerApellido = "";
  segundoApellido = "";
  constructor(init?: IClave) {
    Object.assign(this, init);
  }
}

export class ChangePasswordValues implements IChangePasswordForm {
  token = "";
  contraseña = "";
  confirmaContraseña = "";
  constructor(init?: IChangePasswordForm) {
    Object.assign(this, init);
  }
}
