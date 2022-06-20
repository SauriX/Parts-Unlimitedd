import { IConfigurationEmail, IConfigurationFiscal, IConfigurationGeneral } from "../models/configuration";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Configuration = {
  access: (): Promise<IScopes> => requests.get("/scopes/configuration"),
  getEmail: (): Promise<IConfigurationEmail> => requests.get("/configuration/email"),
  getGeneral: (): Promise<IConfigurationGeneral> => requests.get("/configuration/general"),
  getFiscal: (): Promise<IConfigurationFiscal> => requests.get("/configuration/fiscal"),
  updateEmail: (email: IConfigurationEmail): Promise<void> => requests.put("/configuration/email", email),
  updateGeneral: (general: FormData): Promise<void> => requests.put("/configuration/general", general),
  updateFiscal: (fiscal: IConfigurationFiscal): Promise<void> =>
    requests.put("/configuration/fiscal", fiscal),
};

export default Configuration;
