import { makeAutoObservable } from "mobx";
import Appointment from "../api/appointment";

import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors,tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
import { IAppointmentForm, IAppointmentList, IExportForm, ISearchAppointment, SearchAppointmentValues } from "../models/appointmen";
import Study from "../api/study";
export default class AppoinmentStore {
  constructor() {
    makeAutoObservable(this);
  }
  sucursales!:IAppointmentList[];
  sucursal!:IAppointmentForm;
  search:ISearchAppointment = new SearchAppointmentValues;
  setSearch= (value:ISearchAppointment)=>{
    this.search=value;
};
  access = async () => {
    try {
      //  await User.access();
      if (Date.now() > 100) return;
      else throw new Error("Test");
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  createLab = async (reagent: IAppointmentForm) => {
    try {
        console.log("here");
      await Appointment.createLab(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  createDom = async (reagent: IAppointmentForm) => {
    try {
        console.log("here");
      await Appointment.createLab(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  updateLab = async (user: IAppointmentForm) => {
    try {
      await Appointment.updateLab(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  updateDom = async (user: IAppointmentForm) => {
    try {
      await Appointment.updateDom(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  getAllLab = async (search: ISearchAppointment) => {
    console.log("use");
    try {
      console.log(search);
      const roles= await Appointment.getLab(search);
      console.log(roles);
      this.sucursales = roles;
      return roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.sucursales = [];
    }
  };
  getAllDom = async (search: ISearchAppointment) => {
    
    try {
      console.log(search);
      const roles= await Appointment.getDom(search);
      console.log(roles);
      this.sucursales = roles;
      return roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.sucursales = [];
    }
  };
  getParameter=async(id:number)=>{
    try {
      const reagent = await Study.getById(id);
      return reagent;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    } 
  };
  getByIdLab = async (id: string) => {
   
    try {
      const rol = await Appointment.getByIdLab(id);
      rol.estudy?.map(async (x)=>{ 
        var parametros = await this.getParameter(x.estudioId!) ;
        x.parametros= parametros!.parameters;
        x.nombre= parametros!.nombre
        x.indicaciones = parametros?.indicaciones!;
        x.clave= parametros?.clave!;
      });
      console.log(rol);
      this.sucursal = rol;
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

  getByIdDom = async (id: string) => {
   
    try {
      const rol = await Appointment.getByIdDom(id);
      console.log(rol);
      this.sucursal = rol;
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
  exportList = async (search: ISearchAppointment) => {
    try {
      await Appointment.exportList(search);
      return true
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (data:IExportForm) => {
    try {
      await Appointment.exportForm(data);
      return true;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  }; 

}