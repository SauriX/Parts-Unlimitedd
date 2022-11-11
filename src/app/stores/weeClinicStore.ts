import { makeAutoObservable } from "mobx";
import WeeClinic from "../api/weeClinic";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class WeeClinicStore {
  constructor() {
    makeAutoObservable(this);
  }

  searchPatientByFolio = async (folio: string) => {
    try {
      const folios = await WeeClinic.searchPatientByFolio(folio);
      return folios;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
}
