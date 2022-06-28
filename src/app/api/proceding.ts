import { IProceedingForm, IProceedingList, ISearchMedical } from "../models/Proceeding";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Proceding = {
  access: (): Promise<IScopes> => requests.get("scopes/medic"),
  getAll: (search: string): Promise<IProceedingList[]> => requests.get(`MedicalRecord/all`),
  getNow: (search:ISearchMedical): Promise<IProceedingList[]> => requests.post(`medicalRecord/now`,search??{}),
  getcoincidencia: (search:IProceedingForm): Promise<IProceedingList[]> => requests.post(`medicalRecord/coincidencias`,search??{}),
  getById: (id: string): Promise<IProceedingForm> => requests.get(`MedicalRecord/${id}`),
  //getPermission: (): Promise<IRolePermission[]> => requests.get(`Rol/permisos`), */
  create: (pack: IProceedingForm): Promise<IProceedingList> => requests.post("/MedicalRecord", pack),
  update: (pack: IProceedingForm): Promise<IProceedingList> => requests.put("/MedicalRecord", pack),
  exportList: (search: ISearchMedical): Promise<void> =>
    requests.download(`MedicalRecord/export/list`,search), //, "Catálogo de Sucursales.xlsx"
  exportForm: (id: string): Promise<void> => requests.download(`MedicalRecord/export/form/${id}`), //, `Catálogo de Sucursales (${clave}).xlsx`
};

export default Proceding;