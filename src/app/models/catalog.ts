export interface ICatalogForm {
  id: number;
}

export interface ICatalogList {
  id: number;
}

export interface ICatalogNormalList extends ICatalogList {
  clave: string;
  nombre: string;
  activo: boolean;
}

export interface ICatalogNormalForm extends ICatalogForm {
  clave: string;
  nombre: string;
  activo: boolean;
}

export interface ICatalogDimensionList extends ICatalogList {
  clave: string;
  largo: number;
  ancho: number;
  activo: boolean;
}

export interface ICatalogDimensionForm extends ICatalogForm {
  clave: string;
  largo?: number;
  ancho?: number;
  activo: boolean;
}

export interface ICatalogDescriptionList extends ICatalogNormalList {
  descripcion: string;
}

export interface ICatalogDescriptionForm extends ICatalogNormalForm {
  descripcion: string;
}

export interface ICatalogAreaList extends ICatalogNormalList {
  departamento: string;
}

export interface ICatalogAreaForm extends ICatalogNormalForm {
  departamentoId?: number;
}

export class CatalogNormalFormValues implements ICatalogNormalForm {
  id = 0;
  clave = "";
  nombre = "";
  activo = true;

  constructor(init?: ICatalogNormalForm) {
    Object.assign(this, init);
  }
}

export class CatalogDescriptionFormValues implements ICatalogDescriptionForm {
  id = 0;
  clave = "";
  nombre = "";
  descripcion = "";
  activo = true;

  constructor(init?: ICatalogNormalForm) {
    Object.assign(this, init);
  }
}

export class CatalogDimensionFormValues implements ICatalogDimensionForm {
  id = 0;
  clave = "";
  activo = true;

  constructor(init?: ICatalogNormalForm) {
    Object.assign(this, init);
  }
}

export class CatalogAreaFormValues implements ICatalogAreaForm {
  id = 0;
  clave = "";
  nombre = "";
  activo = true;

  constructor(init?: ICatalogNormalForm) {
    Object.assign(this, init);
  }
}

export interface IProcedenciaList {
  id: number;
  nombre: string;
  Clave: string;
  activo: boolean;
}

export interface IProcedenciaForm {
  id: number;
  nombre: string;
  Clave: string;
  usuarioId: number;
  activo: boolean;
}

export class ProcedenciaFormValues implements IProcedenciaForm {
  id = 0;
  nombre = "";
  Clave= "";
  usuarioId = 0;
  activo = true;

  constructor(init?: IProcedenciaForm) {
    Object.assign(this, init);
  }
}

