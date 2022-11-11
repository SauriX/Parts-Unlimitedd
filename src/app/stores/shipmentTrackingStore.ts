import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import shipmentTracking from "../api/shipmentTracking";
import { shipmenttracking } from "../models/shipmentTracking";
import moment from "moment";
import { reciveTracking } from "../models/ReciveTracking";

export default class shipmentTackingStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
 shipment?:shipmenttracking;
  recive?:reciveTracking
  clearScopes = () => {
    this.scopes = undefined;
  };



  access = async () => {
    try {
      const scopes = await shipmentTracking.access();
      this.scopes = scopes;
      console.log(scopes);
    } catch (error) {
      alerts.warning(getErrors(error));
      //history.push("/forbidden");
    }
  };

  getashipment = async (id:string)=>{
    try {
      console.log("getshipment");
        const scopes = await shipmentTracking.getAll(id);

        scopes.fechaEnvio = moment(scopes.fechaEnvio);
        scopes.horaEnvio = moment(scopes.horaEnvio);
        scopes.fechaEnestimada = moment(scopes.fechaEnestimada);
        scopes.horaEnestimada = moment(scopes.horaEnestimada);
        scopes.fechaEnreal=moment(scopes.fechaEnreal);
        scopes.horaEnreal=moment(scopes.horaEnreal);
        console.log(scopes," shipment");
        this.shipment = scopes;
        return scopes
      } catch (error) {
        alerts.warning(getErrors(error));
        //history.push("/forbidden");
      }
  };
  getaRecive = async (id:string)=>{
    try {
      console.log("getshipment");
        const scopes = await shipmentTracking.getReciveById(id);

        scopes.fechaEnvio = moment(scopes.fechaEnvio);
        scopes.horaEnvio = moment(scopes.horaEnvio);
        scopes.fechaEnestimada = moment(scopes.fechaEnestimada);
        scopes.horaEnestimada = moment(scopes.horaEnestimada);
        scopes.fechaEnreal=moment(scopes.fechaEnreal);
        scopes.horaEnreal=moment(scopes.horaEnreal);
        console.log(scopes," shipment");
        this.recive = scopes;
        return scopes
      } catch (error) {
        alerts.warning(getErrors(error));
        //history.push("/forbidden");
      }
  };
  updateRecive = async (Recive:reciveTracking)=>{
    try{
        const data = await shipmentTracking.updaterecive(Recive);
        return data;
    } catch (error) {
      alerts.warning(getErrors(error));
      //history.push("/forbidden");
    }
  }
  printTicket = async (id:string) => {
    try {
      var response=  await shipmentTracking.getById(id);
      console.log(response,"response");
      await shipmentTracking.exportList(response);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
