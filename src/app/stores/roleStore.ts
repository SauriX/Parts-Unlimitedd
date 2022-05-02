import { makeAutoObservable } from "mobx";
import Rol from "../api/role";
import { IRole, IRoleForm, IRolePermission } from "../models/role";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors, tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
import Role from "../api/role";
import { IScopes } from "../models/shared";

export default class RolStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  roles: IRole[] = [];
  role?: IRoleForm;

  access = async () => {
    try {
      const scopes = await Role.access();
      this.scopes = scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const roles = await Rol.getAll(search);
      this.roles = roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.roles = [];
    }
  };

  getById = async (id: string) => {
    try {
      const role = await Rol.getById(id);
      this.role = role;
      return role;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  getPermission = async () => {
    try {
      return await Role.getPermission();
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  getPermissionById = async (id: string) => {
    try {
      return await Role.getPermissionById(id);
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
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

  exportList = async (search: string) => {
    try {
      await Rol.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: string, clave?: string) => {
    try {
      await Rol.exportForm(id, clave);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
