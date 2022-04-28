import { IParameterForm, IParameterList, ItipoValorForm } from "../models/parameter";
import requests from "./agent";
const Parameter={
    getAll: (search: string): Promise<IParameterList[]> => 
    requests.get(`Parameter/all/${!search ? "all" : search}`),
    getById: (id: string): Promise<IParameterForm> => requests.get(`Parameter/${id}`),
    create: (parameter: IParameterForm): Promise<void> => requests.post("/Parameter", parameter),
    update: (parameter: IParameterForm): Promise<void> => requests.put("/Parameter", parameter),
    addValue:(value:ItipoValorForm): Promise<void> => requests.post("/Parameter/addValue",value),
    getValue:(id:string):Promise<ItipoValorForm> => requests.get(`Parameter/valuetipe/${id}`),
    updateValue: (value:ItipoValorForm) => requests.put("Parameter/valuetipe",value)
}
export default Parameter;