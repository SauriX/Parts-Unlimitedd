import { IRole, IRoleForm, IRolePermission } from "../models/role";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Role = {
  access: (): Promise<IScopes> => requests.get("/scopes/role"),
  getAll: (search: string): Promise<IRole[]> => requests.get(`role/all/${!search ? "all" : search}`),
  getActive: (): Promise<IRole[]> => requests.get(`role/active`),
  getById: (id: string): Promise<IRoleForm> => requests.get(`role/${id}`),
  getPermission: (): Promise<IRolePermission[]> => requests.get(`role/permission`),
  getPermissionById: (id: string): Promise<IRolePermission[]> => requests.get(`role/permission/${id}`),
  create: (role: IRoleForm): Promise<boolean> => requests.post("/role", role),
  update: (role: IRoleForm): Promise<boolean> => requests.put("/role", role),
  exportList: (search: string): Promise<void> =>
    requests.download(`role/export/list/${!search ? "all" : search}`), //, "Catálogo de Roles.xlsx"
  exportForm: (id: string, clave?: string): Promise<void> => requests.download(`role/export/form/${id}`), //, `Catálogo de Roles (${clave}).xlsx`
};

export default Role;
