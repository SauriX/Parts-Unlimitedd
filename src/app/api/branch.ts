import { IBranchForm, IBranchInfo } from "../models/branch";
import requests from "./agent";

const Role = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (search: string): Promise<IBranchInfo[]> => requests.get(`Branch/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IBranchForm> => requests.get(`Branch/${id}`),
  //getPermission: (): Promise<IRolePermission[]> => requests.get(`Rol/permisos`), */
  create: (branch: IBranchForm): Promise<boolean> => requests.post("/Branch", branch),
  update: (branch: IBranchForm): Promise<boolean> => requests.put("/Branch", branch),
  exportList: (search: string): Promise<void> =>
    requests.download(`Branch/export/list/${!search ? "all" : search}`),
  exportForm: (id: string, clave?: string): Promise<void> => requests.download(`Branch/export/form/${id}`),
};

export default Role;
