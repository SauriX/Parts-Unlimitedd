import { makeAutoObservable } from "mobx";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import shipmentTracking from "../api/shipmentTracking";
import { shipmenttracking } from "../models/shipmentTracking";

export default class shipmentTackingStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
 shipment?:shipmenttracking;

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
      history.push("/forbidden");
    }
  };

  getashipment = async (id:string)=>{
    try {
        const scopes = await shipmentTracking.getAll(id);
        console.log(scopes);
        this.shipment = scopes;
      } catch (error) {
        alerts.warning(getErrors(error));
        //history.push("/forbidden");
      }
  };

  printTicket = async (id:string) => {
    try {
      var response=  await shipmentTracking.getById(id);
      await shipmentTracking.exportList(response);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
