import { makeAutoObservable } from "mobx";
import Location from "../api/location";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class LocationStore {
  constructor() {
    makeAutoObservable(this);
  }

  getColoniesByZipCode = async (zipCode: string) => {
    try {
      const colonies = await Location.getColoniesByZipCode(zipCode);
      return colonies;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
