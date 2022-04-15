import { makeAutoObservable } from "mobx";
import Branch from "../api/branch";
import { IBranchForm,IBranchInfo } from "../models/branch";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors,tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
export default class BranchStore {
  constructor() {
    makeAutoObservable(this);
  }
  sucursales!:IBranchInfo[];
  sucursal!:IBranchForm;

  access = async () => {
    try {
      //  await User.access();
      if (Date.now() > 100) return;
      else throw new Error("Test");
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  create = async (reagent: IBranchForm) => {
    try {
        console.log("here");
      await Branch.create(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
   update = async (user: IBranchForm) => {
    try {
      await Branch.update(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getAll = async (search: string="all") => {
    try {
      console.log("oe mira el search");
      console.log(search);
      const roles= await Branch.getAll(search);
      console.log(roles);
      this.sucursales = roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.sucursales = [];
    }
  };

  getById = async (id: string) => {
   
    try {
      const rol = await Branch.getById(id);
      console.log("mira wacho la sucursal");
      console.log(rol);
      this.sucursal = rol;
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
      await Branch.exportList(search);
      return true
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (id: string,clave?:string) => {
    try {
      await Branch.exportForm(id,clave);
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