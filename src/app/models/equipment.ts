export interface IEquipmentList {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  dias?: number;
  valuesEquipment: IEquipmentBranch[];
}

export interface IEquipmentForm {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
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

  constructor(init?: IEquipmentForm) {
    Object.assign(this, init);
  }
}
