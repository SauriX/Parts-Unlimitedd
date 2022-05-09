export interface IMaquiladorList {
  id: number;
  clave: string;
  nombre: string;
  codigoPostal: string;
  estado: string;
  ciudad: string;
  numeroExterior: string;
  numeroInterior: string;
  calle: string;
  coloniaId: number;
  correo: string;
  paginaWeb: string;
  telefono: string;
  activo: boolean;
}

export interface IMaquiladorForm {
  id: number;
  clave: string;
  nombre: string;
  codigoPostal?: string;
  estado?: string;
  ciudad?: string;
  numeroExterior: string;
  numeroInterior: string;
  calle: string;
  coloniaId?: number;
  correo?: string;
  paginaWeb?: string;
  telefono: string;
  activo: boolean;
}
export class MaquiladorFormValues implements IMaquiladorForm {
  id = 0;
  clave = "";
  nombre = "";
  codigoPostal = "";
  estado = undefined;
  ciudad = undefined;
  numeroExterior = "";
  numeroInterior = "";
  calle = "";
  coloniaId = undefined;
  correo = undefined;
  paginaWeb: undefined;
  telefono = "";
  activo = true;

  constructor(init?: IMaquiladorForm) {
    Object.assign(this, init);
  }
}
