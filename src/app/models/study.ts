export interface IStudyList {
  id: number;
  nombre: string;
  areaId: number;
}

export interface IStudyForm {
    id: number;
    nombre: string;
    areaId: number;
}

export class StudyFormValues implements IStudyForm {
  id = 0;
  nombre = "";
  areaId = 0;

  constructor(init?: IStudyForm) {
    Object.assign(this, init);
  }
}