import { makeAutoObservable } from "mobx";
import Parameter from "../api/parameter";
import { IParameterForm, IParameterList, ItipoValorForm } from "../models/parameter";
import alerts from "../util/alerts";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
export default class ParameterStore {
  constructor() {
    makeAutoObservable(this);
  }
  parameters:IParameterList[]=[];
  parameter?:IParameterForm;
  ValueTipe?:ItipoValorForm;
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

  getvalue= async (id: string) => {
   
    try {
      const value = await Parameter.getValue(id);
      this.ValueTipe = value;
      return value;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        //history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
      //this.roles = [];
    }
  };

  create = async (parameter: IParameterForm) => {
    try {
      console.log(parameter);
        console.log("here");
      await Parameter.create(parameter);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (parameter: IParameterForm) => {
    try {
      await Parameter.update(parameter);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updatevalue = async (value:ItipoValorForm) => {
    try {
      await Parameter.updateValue(value);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  addValue = async (value: ItipoValorForm) => {
    try{
      await Parameter.addValue(value);
      alerts.success(messages.created);
      return true;
    }catch(error:any){
      alerts.warning(getErrors(error));
      return false;
    }
  }
}