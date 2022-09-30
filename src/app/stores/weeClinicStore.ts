import { makeAutoObservable } from "mobx";
import WeeClinic from "../api/weeClinic";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";

export default class WeeClinicStore {
  constructor() {
    makeAutoObservable(this);
  }

  Laboratorio_BusquedaFolios = async (folio: string) => {
    try {
      const folios = await WeeClinic.Laboratorio_BusquedaFolios(folio);
      return folios;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
}
