import { IRole, IRoleForm,IRolePermission } from "../models/role";
import requests from "./agent";

const Role = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getAll: (search: string): Promise<IRole[]> => requests.get(`Rol/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IRoleForm> => requests.get(`Rol/rol/${id}`),
  getPermission: (): Promise<IRolePermission[]> => requests.get(`Rol/permisos`),
  create: (role: IRoleForm): Promise<boolean> => requests.post("/Rol", role),
  update: (role: IRoleForm): Promise<boolean> => requests.put("/Rol  ", role),
  exportList: (search: string): Promise<void> =>
  requests.download(`Rol/export/list/${!search ? "all" : search}`, "Catálogo de Roles.xlsx"),
  exportForm: (id: string, clave?: string): Promise<void> =>
  requests.download(`Rol/export/form/${id}`, `Catálogo de Roles (${clave}).xlsx`),
};

export default Role;
