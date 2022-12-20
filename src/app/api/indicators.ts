import { IReportIndicators, IReportIndicatorsFilter } from "../models/indicators";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Indicators = {
  access: (): Promise<IScopes> => requests.get("scopes/indicators"),
  getByFilter: (filter: IReportIndicatorsFilter): Promise<IReportIndicators[]> =>
    requests.post(`report/indicators/filter`, filter),
  printPdf: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicators/download/pdf`, filter),
};

export default Indicators;