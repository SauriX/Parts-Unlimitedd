export interface IRole {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  permisos?: IRolePermission[];
}

export interface IRolePermission {
  id: number;
  menuId: number;
  menu: string;
  permiso: string;
  asignado: boolean;
  tipo: number;
}

export class RoleFormValues implements IRole {
  id: number = 0;
  nombre: string = "";
  descripcion: string = "";
  activo: boolean = true;

  constructor(init?: IRole) {
    Object.assign(this, init);
  }
}
