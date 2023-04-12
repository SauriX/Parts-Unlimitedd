import { IPacketList, IPackForm } from "../models/packet";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Pack = {
  access: (): Promise<IScopes> => requests.get("scopes/medic"),
  getAll: (search: string): Promise<IPacketList[]> => requests.get(`pack/all/${!search ? "all" : search}`),
  getPackList: (search: string): Promise<IPacketList[]> => requests.get(`pack/packList/${!search ? "all" : search}`),
  getActive: (): Promise<IPacketList[]> => requests.get(`pack/active`),
  getById: (id: number): Promise<IPackForm> => requests.get(`pack/${id}`),
  //getPermission: (): Promise<IRolePermission[]> => requests.get(`Rol/permisos`), */
  create: (pack: IPackForm): Promise<boolean> => requests.post("/pack", pack),
  update: (pack: IPackForm): Promise<boolean> => requests.put("/pack", pack),
  exportList: (search: string): Promise<void> =>
    requests.download(`pack/export/list/${!search ? "all" : search}`), //, "Catálogo de Sucursales.xlsx"
  exportForm: (id: number): Promise<void> => requests.download(`pack/export/form/${id}`), //, `Catálogo de Sucursales (${clave}).xlsx`
};

export default Pack;
