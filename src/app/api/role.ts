import { IRole } from "../models/role";
import requests from "./agent";

const Role = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (): Promise<IRole[]> => requests.get("/user/role"),
  getById: (id: number): Promise<IRole> => requests.get(`/user/role/${id}`),
  create: (role: IRole): Promise<number> => requests.post("/user/role", role),
  update: (role: IRole): Promise<void> => requests.put("/user/role", role),
};

export default Role;
