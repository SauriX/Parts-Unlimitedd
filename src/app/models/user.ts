
export interface IUserInfo {
  id: string;
  clave:string;
  nombre: string;
  primerApellido: string,
  segundoApellido: string,
  tipoUsuario:string,
  idRol: string,
  idSucursal: number,
  activo: boolean
} 

export interface ILoginForm {
  userName:string,
  password:string
}
export interface ILoginResponse{
  token: string,
  changePassword: boolean,
  id:string
}
export interface IUser {
  id: string;
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
export interface IChangePasswordForm {
  token:string,
  password:string,
  confirmPassword: string;
}
export interface IUserPermission {
  id: number;
  menuId: number;
  menu: string;
  permiso: string;
  asignado: boolean;
  tipo: number;
}
export interface IChangePasswordResponse {
  idUsuario: string,
  clave: string,
  nombre: string,
  primerApellido: string,
  segundoApellido: string,
  idRol: string,
  idSucursal: Number,
  contraseña: string,
  activo: boolean,
  usuarioCreoId: string,
  fechaCreo: string,
  usuarioModId: string,
  fechaMod: string,
  flagpassword: true,
  id: string,
  userName: string,
  normalizedUserName: string,
  email: string,
  normalizedEmail: string,
  emailConfirmed: true,
  passwordHash: string,
  securityStamp: string,
  concurrencyStamp: string,
  phoneNumber: string,
  phoneNumberConfirmed: boolean,
  twoFactorEnabled: boolean,
  lockoutEnd: string,
  lockoutEnabled: boolean,
  accessFailedCount: Number
}
export class UserFormValues implements IUser {
  id ="";
  clave ="";
  nombre ="";
  primerApellido ="";
  segundoApellido ="";
  activo = true;

  constructor(init?: IUser) {
    Object.assign(this, init);
  }
}

export class LoginFormValues implements ILoginForm{
  userName ="";
  password ="";
  constructor(init?: ILoginForm){
    Object.assign(this,init);
  }
}

export class ChangePasswordValues implements IChangePasswordForm{
  token="";
  password="";
  confirmPassword ="";
  constructor(init?: IChangePasswordForm){
    Object.assign(this,init);
  }
}