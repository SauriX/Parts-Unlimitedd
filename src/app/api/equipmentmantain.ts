import { IEquipmentForm, IEquipmentList } from "../models/equipment";
import { Idetail, ImantainForm, IMantainList, ISearchMantain } from "../models/equipmentMantain";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Equipmentmantain = {
  access: (): Promise<IScopes> => requests.get("scopes/equipment"),
  getAll: (search: ISearchMantain): Promise<IMantainList[]> =>
    requests.post(`mantain/all`, search),
  getById: (id: string): Promise<ImantainForm> =>
    requests.get(`mantain/${id}`),
  getequip: (id: number): Promise<Idetail> =>
    requests.get(`mantain/equipo/${id}`),
  create: (equipment: ImantainForm): Promise<IMantainList> =>
    requests.post("mantain", equipment),
  update: (equipment: ImantainForm): Promise<void> =>
    requests.put("mantain", equipment),
  saveImage: (formData: FormData): Promise<void> => requests.put("mantain/images", formData),
  print: (recordId: string): Promise<void> =>
    requests.print(`mantain/order/${recordId}`),
  exportList: (search: string): Promise<void> =>
    requests.download(`equipment/export/list/${!search ? "all" : search}`),
  exportForm: (id: number): Promise<void> =>
    requests.download(`equipment/export/form/${id}`),
  deleteImage: (
    Id: string,
    code: string
  ): Promise<void> =>
    requests.delete(`mantain/image/${Id}/${code}`),
  updateStatus: (id: string): Promise<void> => requests.put(`mantain/status/${id}`, id),
};

export default Equipmentmantain;
