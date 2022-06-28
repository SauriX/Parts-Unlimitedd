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
      var ciudades = citys.filter(x=>x.id==1906||x.id==1909||x.id==932||x.id==1965||x.id==968||x.id==978);
      this.cityOptions=  ciudades.map((x)=>({
        value:x.ciudad,
        label:x.ciudad
      }));
      console.log(this.cityOptions,"options");
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  // getCity2 = async () => {
  //   try {
  //     const ciudades = await Location.getCity();
  //     return ciudades;
  //   } catch (error: any) {
  //     alerts.warning(getErrors(error));
  //   }
  // };
}
