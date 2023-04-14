import {
  IModalIndicatorsFilter,
  IReportIndicators,
  IReportIndicatorsFilter,
  ISamplesCost,
  IServicesCost,
  IServicesInvoice,
  IUpdateService,
} from "../models/indicators";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Indicators = {
  access: (): Promise<IScopes> => requests.get("scopes/report"),
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
  updateServiceCost: (updateService: IUpdateService): Promise<void> =>
    requests.put(`report/indicadores/fijo`, updateService),
  getForm: (indicators: IReportIndicators): Promise<void> =>
    requests.post(`report/indicadores/getForm`, indicators),
  getSamplesCostsByFilter: (
    filter: IModalIndicatorsFilter
  ): Promise<ISamplesCost[]> =>
    requests.post(`report/indicadores/toma/filter`, filter),
  getServicesCost: (
    filter: IModalIndicatorsFilter
  ): Promise<IServicesInvoice> =>
    requests.post(`report/indicadores/servicios/filter`, filter),
  saveFile: (file: FormData): Promise<string> =>
    requests.put("report/indicadores/saveFile", file),
  exportList: (filter: IReportIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/export/list`, filter),
  exportSamplingList: (filter: IModalIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/export/samplingList`, filter),
  exportServiceList: (filter: IModalIndicatorsFilter): Promise<void> =>
    requests.download(`report/indicadores/export/serviceList`, filter),
  exportServiceListExample: (): Promise<void> =>
    requests.download(`report/indicadores/export/serviceListExample`),
};

export default Indicators;
