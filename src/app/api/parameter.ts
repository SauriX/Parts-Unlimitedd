import { IParameterForm, IParameterList, ItipoValorForm } from "../models/parameter";
import requests from "./agent";

const Parameter = {
  getAll: (search: string): Promise<IParameterList[]> =>
    requests.get(`parameter/all/${!search ? "all" : search}`),
  getById: (id: string): Promise<IParameterForm> => requests.get(`parameter/${id}`),
  getAllValues: (id: string, type: string): Promise<ItipoValorForm[]> =>
    requests.get(`parameter/all/values/${id}/${type}`),
  getValue: (id: string): Promise<ItipoValorForm> => requests.get(`parameter/value/${id}`),
  create: (parameter: IParameterForm): Promise<void> => requests.post("/parameter", parameter),
  addValue: (value: ItipoValorForm): Promise<void> => requests.post("/parameter/value", value),
  update: (parameter: IParameterForm): Promise<void> => requests.put("/parameter", parameter),
  updateValue: (value: ItipoValorForm) => requests.put("parameter/value", value),
  deletevalue: (id: string): Promise<ItipoValorForm> => requests.delete(`parameter/${id}`),
  exportList: (search: string): Promise<void> =>
    requests.download(`parameter/export/list/${!search ? "all" : search}`),
  exportForm: (id: string): Promise<void> => requests.download(`parameter/export/form/${id}`),
};

export default Parameter;
