import { IEquipmentForm, IEquipmentList } from "../models/equipment";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Equipment = {
  access: (): Promise<IScopes> => requests.get("scopes/equipment"),
  getAll: (search: string): Promise<IEquipmentList[]> =>
    requests.get(`equipment/all/${!search ? "all" : search}`),
  getById: (id: number): Promise<IEquipmentForm> =>
    requests.get(`equipment/${id}`),
  create: (equipment: IEquipmentForm): Promise<void> =>
    requests.post("equipment", equipment),
  update: (equipment: IEquipmentForm): Promise<void> =>
    requests.put("equipment", equipment),
  exportList: (search: string): Promise<void> =>
    requests.download(`equipment/export/list/${!search ? "all" : search}`),
  exportForm: (id: number): Promise<void> =>
    requests.download(`equipment/export/form/${id}`),
};

export default Equipment;
