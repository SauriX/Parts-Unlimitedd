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
        console.log("here");
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
      console.log(search);
      const roles= await Pack.getAll(search);
      console.log(roles);
      this.packs= roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.packs = [];
    }
  };
  getAllStudy = async () =>{
    try {
        
        const roles= await Study.getAll("all");
        console.log(roles);
        console.log(roles);
        this.studies= roles.map((x) => {
            let data:IPackEstudioList = {
                id: x.id,
                clave: x.clave,
                nombre: x.nombre,
                area:x.area,
                departamento:x.departamento,
                activo: false,
            }
            return data;});

            console.log("estudios");
            console.log(this.studies);
      } catch (error: any) {
        alerts.warning(getErrors(error));
        this.packs = [];
      }
  };
  getById = async (id: number) => {
   
    try {
      const rol = await Pack.getById(id);
      console.log(rol);
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