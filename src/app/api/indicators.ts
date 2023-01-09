import { IReportIndicators, IReportIndicatorsFilter } from "../models/indicators";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Indicators = {
  access: (): Promise<IScopes> => requests.get("scopes/indicators"),
  getByFilter: (filter: IReportIndicatorsFilter): Promise<IReportIndicators[]> =>
    requests.post(`report/indicadores/filter`, filter),
  create: (indicators: IReportIndicators): Promise<void> =>
    requests.post(`report/indicadores`, indicators),
  update: (indicators: IReportIndicators): Promise<void> =>
    requests.put(`report/indicadores`, indicators),
  getForm: (indicators: IReportIndicators): Promise<void> =>
    requests.post(`report/indicadores/getForm`, indicators),
  getServicesCost: (filter: IReportIndicatorsFilter): Promise<IReportIndicators[]> =>
    requests.post(`report/indicadores/services/filter`, filter),
  exportList: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/exports/list`, filter),
  exportSamplingList: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/exports/samplingList`, filter),
  exportServiceList: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/exports/serviceList`, filter),
};

export default Indicators;