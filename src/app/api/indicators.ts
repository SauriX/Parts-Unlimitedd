import {
  IReportIndicators,
  IReportIndicatorsFilter,
  ISamplesCost,
} from "../models/indicators";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Indicators = {
  access: (): Promise<IScopes> => requests.get("scopes/indicators"),
  getByFilter: (
    filter: IReportIndicatorsFilter
  ): Promise<IReportIndicators[]> =>
    requests.post(`report/indicadores/filter`, filter),
  create: (indicators: IReportIndicators): Promise<void> =>
    requests.post(`report/indicadores`, indicators),
  update: (indicators: IReportIndicators): Promise<void> =>
    requests.put(`report/indicadores`, indicators),
  updateSampleCost: (samples: ISamplesCost): Promise<void> =>
    requests.put(`report/indicadores/toma`, samples),
  getForm: (indicators: IReportIndicators): Promise<void> =>
    requests.post(`report/indicadores/getForm`, indicators),
  getSamplesCostsByFilter: (
    filter: IReportIndicatorsFilter
  ): Promise<IReportIndicators[]> =>
    requests.post(`report/indicadores/toma/filter`, filter),
  getServicesCost: (
    filter: IReportIndicatorsFilter
  ): Promise<IReportIndicators[]> =>
    requests.post(`report/indicadores/servicios/filter`, filter),
  exportList: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/export/list`, filter),
  exportSamplingList: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/export/samplingList`, filter),
  exportServiceList: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/export/serviceList`, filter),
};

export default Indicators;
