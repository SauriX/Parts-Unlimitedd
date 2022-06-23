import { makeAutoObservable } from "mobx";
import Location from "../api/location";
import { IOptions } from "../models/shared";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class LocationStore {
  constructor() {
    makeAutoObservable(this);
  }

  cityOptions:IOptions[]=[];
  getColoniesByZipCode = async (zipCode: string) => {
    try {
      const colonies = await Location.getColoniesByZipCode(zipCode);
      return colonies;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getCity= async () => {
    try {
      const citys= await Location.getCities()
      console.log(citys,"ciudades");
      this.cityOptions=  citys.map((x)=>({
        value:x.ciudad,
        label:x.ciudad
      }));
      console.log(this.cityOptions,"options");
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
