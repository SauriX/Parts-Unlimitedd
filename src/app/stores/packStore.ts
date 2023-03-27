import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors,tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
import { IPackEstudioList, IPacketList, IPackForm } from "../models/packet";
import Pack from "../api/pack";
import { IScopes } from "../models/shared";
import Study from "../api/study";
export default class PackStore {
  constructor() {
    makeAutoObservable(this);
  }
  scopes?: IScopes;
  packs!:IPacketList[];
  pack!:IPackForm;
  studies:IPackEstudioList[]=[];
  clearScopes = () => {
    this.scopes = undefined;
  };
  access = async () => {
    try {
      const scopes = await Pack.access();
      this.scopes = scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  create = async (reagent: IPackForm) => {
    try {
      await Pack.create(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
   update = async (user: IPackForm) => {
    try {
      await Pack.update(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getAll = async (search: string="all") => {
    try {
      const roles= await Pack.getAll(search);
      this.packs= roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.packs = [];
    }
  };
  getAllStudy = async () =>{
    try {
        
        const roles= await Study.getAll("all");
        const activos = roles.filter(x => x.activo);
        var studies= activos.map((x) => {
            let data:IPackEstudioList = {
                id: x.id,
                clave: x.clave,
                nombre: x.nombre,
                area:x.area,
                departamento:x.departamento,
                activo: false,
            }
            return data;});
            this.studies=studies;
            return studies
      } catch (error: any) {
        alerts.warning(getErrors(error));
        this.packs = [];
      }
  };
  getById = async (id: number) => {
   
    try {
      const rol = await Pack.getById(id);
      this.pack = rol;
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        //history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
      //this.roles = [];
    }
  };
  exportList = async (search: string) => {
    try {
      await Pack.exportList(search);
      return true
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (id: number) => {
    try {
      await Pack.exportForm(id);
      return true;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  }; 
}