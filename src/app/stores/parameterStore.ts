import { makeAutoObservable } from "mobx";
import Parameter from "../api/parameter";
import { IParameterForm, IParameterList } from "../models/parameter";
import alerts from "../util/alerts";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
export default class ParameterStore {
  constructor() {
    makeAutoObservable(this);
  }
  parameters:IParameterList[]=[];
  parameter?:IParameterForm;
  getAll = async (search: string="all") => {
    try {
      console.log(search);
      const parameters= await Parameter.getAll(search);
      this.parameters = parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.parameters = [];
    }
  };
  
  getById = async (id: string) => {
   
    try {
      const rol = await Parameter.getById(id);
    
      console.log(rol);
      this.parameter = rol;
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        //history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
      //this.roles = [];
    }
  };
}