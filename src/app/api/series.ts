import {
  ISeries,
  ISeriesExpedition,
  ISeriesFilter,
  ISeriesList,
  ISeriesNewForm,
  ITicketSerie,
} from "../models/series";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Series = {
  access: (): Promise<IScopes> => requests.get("scopes/series"),
  getByBranch: (branchId: string, type: number): Promise<ISeriesList[]> =>
    requests.get(`series/branch/${branchId}/${type}`),
  getByFilter: (filter: ISeriesFilter): Promise<ISeriesList[]> =>
    requests.post(`series/filter`, filter),
  getNewForm: (newForm: ISeriesNewForm): Promise<ISeries> =>
    requests.post(`series/new`, newForm),
  getById: (id: number, tipoSerie: number): Promise<ISeries> => requests.get(`series/${id}/${tipoSerie}`),
  getBranch: (branchId: string): Promise<ISeriesExpedition> => requests.get(`series/${branchId}`),
  createInvoice: (serie: FormData): Promise<void> =>
    requests.post(`series/invoice`, serie),
  updateInvoice: (serie: FormData): Promise<void> =>
    requests.put(`series/invoice`, serie),
  createTicket: (ticket: ITicketSerie): Promise<void> =>
    requests.post(`series/ticket`, ticket),
  updateTicket: (ticket: ITicketSerie): Promise<void> =>
    requests.put(`series/ticket`, ticket),
  exportList: (filter: ISeriesFilter): Promise<void> =>
    requests.download(`series/export/list`, filter),
};

export default Series;
