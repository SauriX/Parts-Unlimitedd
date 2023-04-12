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
  instrucciones:string,
  diasEstabilidad:number,
  diasRefrigeracion:number,
}

export interface IStudyTag {
  destinoId: string;
  destino: string;
  destinoTipo: number;
  etiquetaId: number;
  estudioId: number;
  claveEtiqueta: string;
  claveInicial: string;
  nombreEtiqueta: string;
  cantidad: number;
  orden: number;
  color: string;
  observaciones?: string;
  nombreEstudio: string;
  claveEstudio: string;
}
export interface IStudyTec{
  instrucciones: string,
  tipoMuestra: string,
  diasEstabilidad: number,
  diasRefrigeracion: number,
  diasEntrega:string,
  tapon:string
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
  workLists = "";
  instrucciones = "";
  diasEstabilidad=0;
  diasRefrigeracion=0;
  constructor(init?: IStudyForm) {
    Object.assign(this, init);
  }
}
