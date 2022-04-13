import { makeAutoObservable } from "mobx";
import Rol from "../api/role";
import { IRole, IRoleForm, IRolePermission } from "../models/role";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors,tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
import Role from "../api/role";
export default class RolStore {
  constructor() {
    makeAutoObservable(this);
  }
  permisos!:IRolePermission[];
  roles:IRole[]=[];
  role!:IRoleForm;

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
  getPermission = async () => {
    try {
      let permisos=await Role.getPermission();
      this.permisos = permisos;
      console.log("aqui andan los permisos wacho");
      console.log(this.permisos);
      return true;
    } catch (error: any) {
      return false;
    }
  };
  create = async (reagent: IRoleForm) => {
    try {
        
      await Role.create(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  update = async (user: IRoleForm) => {
    try {
      await Rol.update(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getAll = async (search: string) => {
    try {
      const roles= await Rol.getAll(search);
      this.roles = roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.roles = [];
    }
  };

  getById = async (id: string) => {
    console.log(id);
    this.roles = [];
    try {
      const rol = await Rol.getById(id);
      this.permisos = rol.permisos;
      this.role = rol;
      console.log(this.permisos);
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  exportList = async (search: string) => {
    try {
      await Rol.exportList(search);
      return true
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (id: string,clave?:string) => {
    try {
      await Rol.exportForm(id,clave);
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