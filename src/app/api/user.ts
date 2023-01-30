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
import requests from "./agent";

const User = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (search: string): Promise<IUserList[]> =>
    requests.get(`user/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IUserForm> => requests.get(`user/${id}`),
  getCode: (data: IClave): Promise<string> => requests.post(`user/code`, data),
  getPassword: (): Promise<string> => requests.get(`user/passwordGenerator`),
  create: (user: IUserForm): Promise<IUserList> => requests.post("user", user),
  exportList: (search: string): Promise<void> =>
    requests.download(`user/export/list/${!search ? "all" : search}`), // , "Catálogo de Usuarios.xlsx"
  exportForm: (id: string): Promise<void> =>
    requests.download(`user/export/form/${id}`), // , `Catálogo de Usuarios (${clave}).xlsx`
  getPermission: (): Promise<IUserPermission[]> =>
    requests.get(`user/permission`),
  update: (user: IUserForm): Promise<IUserList> => requests.put("user", user),
  updateBranch: (branchId: string): Promise<IUserList> =>
    requests.post(`user/updateBranch/${branchId}`, branchId),
  changePass: (form: IChangePasswordForm): Promise<void> =>
    requests.put("user/password", form),
  saveImage: (formData: FormData): Promise<string> =>
    requests.put("user/images", formData),
};

export default User;
