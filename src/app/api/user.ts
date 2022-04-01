import { IUser, IUserInfo,ILoginForm,ILoginResponse,IChangePasswordResponse,IChangePasswordForm } from "../models/user";
import requests from "./agent";

const User = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (search: string): Promise<IUserInfo[]> => requests.get(`Account/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IUser> => requests.get(`/user/${id}`),
  create: (user: IUser): Promise<IUserInfo> => requests.post("/user", user),
  update: (user: IUser): Promise<IUserInfo> => requests.put("/user", user),
  login:(user:ILoginForm):Promise<ILoginResponse>=>requests.post("Session/login",user),
  changePass:(form:IChangePasswordForm):Promise<IChangePasswordResponse>=>requests.put("Account/updatepassword",form),
};

export default User;
