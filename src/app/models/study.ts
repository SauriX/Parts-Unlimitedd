export interface IStudyList {
  id: number;
  clave: string;
  nombre: string;
  areaId: number;
  area: string;
}

export interface IStudyForm {
    id: number;
    clave: string;
    nombre: string;
    areaId: number;
    area: string;
}

export class StudyFormValues implements IStudyForm {
  id = 0;
  clave = "";
  nombre = "";
  areaId = 0;
  area= "";

  constructor(init?: IStudyForm) {
    Object.assign(this, init);
  }
}