import { IUser, IUserInfo } from "../models/user";
import requests from "./agent";

const User = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (): Promise<IUserInfo[]> => requests.get("/user"),
  getById: (id: number): Promise<IUser> => requests.get(`/user/${id}`),
  create: (user: IUser): Promise<IUserInfo> => requests.post("/user", user),
  update: (user: IUser): Promise<IUserInfo> => requests.put("/user", user),
};

export default User;
