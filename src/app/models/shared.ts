export interface IProfile {
  nombre: string;
  token?: string;
  requiereCambio: boolean;
}

export interface IScopes {
  pantalla: string;
  acceder: boolean;
  crear: boolean;
  modificar: boolean;
  descargar: boolean;
  imprimir: boolean;
  enviarCorreo: boolean;
  enviarWapp: boolean;
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

export interface ICatalog {
  id: number;
  nombre: string;
}
