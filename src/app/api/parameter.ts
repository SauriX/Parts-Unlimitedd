import { IParameterForm, IParameterList } from "../models/parameter";
import requests from "./agent";
const Parameter={
    getAll: (search: string): Promise<IParameterList[]> => 
    requests.get(`Parameter/all/${!search ? "all" : search}`),
    getById: (id: string): Promise<IParameterForm> => requests.get(`Parameter/${id}`),
}
export default Parameter;