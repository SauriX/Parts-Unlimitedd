import { IWeeLabFolioInfo } from "../models/weeClinic";
import requests from "./agent";

const WeeClinic = {
  searchPatientByFolio: (folio: string): Promise<IWeeLabFolioInfo> =>
    requests.get(`weeClinic/search/folio/${folio}`),
};

export default WeeClinic;
