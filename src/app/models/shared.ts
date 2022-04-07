export interface IProfile {
  nombre: string;
  token?: string;
}

export interface IScopes {
  pantalla: string;
  acceder: boolean;
  crear: boolean;
  editar: boolean;
  descargar: boolean;
}

export interface ILogin {
  usuario: string;
  contraseña: string;
  confirmacionContraseña?: string;
}

export interface IMenu {
  id: number;
  ruta?: string;
  icono: string;
  descripcion: string;
  subMenus?: IMenu[];
}

export interface IOptions {
  label: string;
  value: number | string;
}

export interface IOptionsCatalog extends IOptions {
  type: "normal" | "description" | "dimension" | "area";
}

export type TreeData = {
  title: string;
  key: string;
  children?: TreeData[];
};

export interface ISearchParams {
  search: string;
  mode: "edit" | "readonly";
}
