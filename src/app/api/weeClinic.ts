import { IWeeLabBusquedaFolios } from "../models/weeClinic";
import requests from "./agent";

const WeeClinic = {
  Laboratorio_BusquedaFolios: (
    folio: string
  ): Promise<IWeeLabBusquedaFolios[]> =>
    requests.get(`weeClinic/Laboratorio_BusquedaFolios/${folio}`),
};

export default WeeClinic;
