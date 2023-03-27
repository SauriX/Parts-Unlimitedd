import { makeAutoObservable } from "mobx";
import User from "../api/user";
import {
  IUserPermission,
  IUserList,
  ILoginForm,
  ILoginResponse,
  IChangePasswordResponse,
  IChangePasswordForm,
  IUserForm,
  IClave,
} from "../models/user";
import { IRole, IRolePermission } from "../models/role";
import { IOptions } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors, tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
import Role from "../api/role";
export default class UserStore {
  constructor() {
    makeAutoObservable(this);
  }
  roles: IRole[] = [];
  users: IUserList[] = [];
  options: IOptions[] = [];
  Token: string = "";
  changePasswordFlag: boolean = false;
  idUser: string = "";
  response?: ILoginResponse;
  changepassResponse?: IChangePasswordResponse;
  user?: IUserForm;
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
      let permisos = await User.getPermission();
      return permisos;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getAll = async (search: string) => {
    try {
      const users = await User.getAll(search);
      this.users = users;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.users = [];
    }
  };
  deleteImage = async (recordId: string, requestId: string, code: string) => {
    try {
      //await Request.deleteImage(recordId, requestId, code);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  saveImage = async (request: FormData) => {
    try {
      var imageName = await User.saveImage(request);
      return imageName;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
  exportList = async (search: string) => {
    try {
      await User.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (id: string) => {
    try {
      await User.exportForm(id);
      return true;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  getById = async (id: string) => {
    try {
      const user = await User.getById(id);
      // this.permisos = user.permisos;
      this.user = user;
      return user;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  create = async (reagent: IUserForm) => {
    try {
      await User.create(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (user: IUserForm) => {
    try {
      await User.update(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  updateBranch = async (branchId: string) => {
    try {
      await User.updateBranch(branchId);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  sucrusalesId: string[] = [];
  setSucursalesId = (sucrusalesId: any) => {
    this.sucrusalesId = sucrusalesId;
  };
  getSucursalesId = () => {
    return this.sucrusalesId;
  };
  changePassordF = async () => {
    return await this.changePasswordFlag;
  };
  Clave = async (data: IClave) => {
    const response = await User.getCode(data);
    return await response;
  };

  generatePass = async () => {
    const response = await User.getPassword();
    return await response;
  };

  changePassword = async (form: IChangePasswordForm) => {
    try {
      await User.changePass(form);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
}
