import { IIndicationList } from "./indication";
import { IPacketList } from "./packet";
import { IParameterList } from "./parameter";
import { IReagentList } from "./reagent";
import { IWorkList } from "./workList";

export interface IStudyList {
  id: number;
  clave: string;
  nombre: string;
  titulo: string;
  area: string;
  departamento: string;
  maquilador: string;
  metodo: string;
  activo: boolean;
  areaId: number;
}

export interface IStudyForm {
  id: number;
  clave: string;
  orden: number;
  nombre: string;
  titulo: string;
  nombreCorto: string;
  visible: boolean;
  dias: number;
  activo: boolean;
  area: number;
  departamento: number;
  workLists: string;
  maquilador: number;
  metodo: number;
  tipomuestra: number;
  tiemporespuesta: number;
  diasrespuesta: number;
  tapon: number;
  cantidad: number;
  prioridad: boolean;
  urgencia: boolean;
  workList: IWorkList[];
  parameters: IParameterList[];
  indicaciones: IIndicationList[];
  reactivos: IReagentList[];
  paquete: IPacketList[];
}

export class StudyFormValues implements IStudyForm {
  id = 0;
  clave = "";
  orden = 0;
  nombre = "";
  titulo = "";
  nombreCorto = "";
  visible = false;
  dias = 0;
  activo = false;
  area = 0;
  departamento = 0;
  formato = 0;
  maquilador = 0;
  metodo = 0;
  tipomuestra = 0;
  tiemporespuesta = 0;
  diasrespuesta = 0;
  prioridad = true;
  urgencia = true;
  workList: IWorkList[] = [];
  parameters: IParameterList[] = [];
  indicaciones: IIndicationList[] = [];
  reactivos: IReagentList[] = [];
  paquete: IPacketList[] = [];
  tapon = 0;
  cantidad = 0;
  workLists="";
  constructor(init?: IStudyForm) {
    Object.assign(this, init);
  }
}
