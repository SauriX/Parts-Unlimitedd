import React from "react";

export interface IProfile {
  nombre: string;
  token?: string;
  requiereCambio: boolean;
  sucursal: string;
  admin: boolean;
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
  key?: string | number;
  label: string | React.ReactNode;
  value: number | string;
  group?: string | number;
  options?: IOptions[];
}

export interface IOptionsCatalog extends IOptions {
  type: "normal" | "description" | "dimension" | "area";
}

export interface IOptionsReport extends IOptions {
  type: "expediente" | "estadistica" ;
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

export interface IFormError {
  name: string;
  errors: string[];
}
