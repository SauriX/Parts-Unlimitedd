export interface IEquipmentList {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  dias?: number;
  valores: IEquipmentBranch[];
}

export interface IEquipmentForm {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  valores: IEquipmentBranch[];
}
export interface IEquipmentBranch {
  num_serie?: string;
  branchId: number;
  branch: string;
}

export class EquipmentFormValues implements IEquipmentForm {
  id = 0;
  clave = "";
  nombre = "";
  descripcion = "";
  activo = true;
  valores: IEquipmentBranch[] = [];

  constructor(init?: IEquipmentForm) {
    Object.assign(this, init);
  }
}
