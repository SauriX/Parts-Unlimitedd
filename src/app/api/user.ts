import { IUser, IUserInfo,ILoginForm,ILoginResponse,IChangePasswordResponse,IChangePasswordForm, IUserForm,IClave } from "../models/user";
import requests from "./agent";

const User = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (search: string): Promise<IUserInfo[]> => requests.get(`Account/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IUserForm> => requests.get(`Account/user/${id}`),
  getClave: (data: IClave): Promise<string> => requests.post(`Account/user/clave`,data),
  gepass: (): Promise<string> => requests.get(`Account/user/paswwordgenerator`),
  create: (user: IUserForm): Promise<IUserInfo> => requests.post("Account", user),
  update: (user: IUserForm): Promise<IUserInfo> => requests.put("Account", user),
  login:(user:ILoginForm):Promise<ILoginResponse>=>requests.post("Session/login",user),
  changePass:(form:IChangePasswordForm):Promise<IChangePasswordResponse>=>requests.put("Account/updatepassword",form),
};

export default User;