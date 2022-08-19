import { IEquipmentForm, IEquipmentList } from "../models/equipment";
import { ImantainForm, IMantainList, ISearchMantain } from "../models/equipmentMantain";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Equipmentmantain = {
  access: (): Promise<IScopes> => requests.get("scopes/equipment"),
  getAll: (search: ISearchMantain): Promise<IMantainList[]> =>
    requests.post(`mantain/all`,search),
  getById: (id: string): Promise<ImantainForm> =>
    requests.get(`mantain/${id}`),
  create: (equipment: ImantainForm): Promise<void> =>
    requests.post("mantain", equipment),
  update: (equipment: ImantainForm): Promise<void> =>
    requests.put("mantain", equipment),
    saveImage: (formData: FormData): Promise<void> => requests.put("mantain/images", formData),
  exportList: (search: string): Promise<void> =>
    requests.download(`equipment/export/list/${!search ? "all" : search}`),
  exportForm: (id: number): Promise<void> =>
    requests.download(`equipment/export/form/${id}`),
};

export default Equipmentmantain;
