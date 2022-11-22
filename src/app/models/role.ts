export interface IRole {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  permisos?: IRolePermission[];
}

export interface IRoleForm {
  id: string;
  nombre: string;
  activo: boolean;
  permisos: IRolePermission[];
}

export interface IRolePermission {
  id: number;
  menuId: number;
  menu: string;
  permiso: string;
  asignado: boolean;
  tipo: number;
}

export class RoleFormValues implements IRoleForm {
  id = "";
  nombre = "";
  activo = true;
  permisos = [];
  constructor(init?: IRoleForm) {
    Object.assign(this, init);
  }
}

export class RoleValues implements IRole {
  id = "";
  nombre = "";
  descripcion = "";
  activo = true;

  constructor(init?: IRole) {
    Object.assign(this, init);
  }
}
