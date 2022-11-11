import { IProceedingList } from "../models/Proceeding";
import { IPromotionForm, IPromotionList } from "../models/promotion";
import {
  IQuotationExpedienteSearch,
  IQuotationForm,
  IQuotationInfo,
  IQuotationFilter,
  ISolicitud,
} from "../models/quotation";
import { IRequestGeneral } from "../models/request";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Quotation = {
  access: (): Promise<IScopes> => requests.get("scopes/reagent"),
  getQuotations: (filter: IQuotationFilter): Promise<IQuotationInfo[]> =>
    requests.post(`priceQuote/filter`, filter),
  create: (promotion: IQuotationForm): Promise<boolean> =>
    requests.post("/priceQuote", promotion),
  getRecord: (search: IQuotationExpedienteSearch): Promise<IProceedingList[]> =>
    requests.post(`priceQuote/records`, search ?? {}),
  getById: (id: string): Promise<IQuotationForm> =>
    requests.get(`priceQuote/${id}`),
  update: (promotion: IQuotationForm): Promise<string> =>
    requests.put("priceQuote", promotion),
  createSolicitud: (promotion: ISolicitud): Promise<string> =>
    requests.post("/priceQuote/solicitud", promotion),
  exportList: (search: IQuotationFilter): Promise<void> =>
    requests.download(`priceQuote/export/list`, search),
  exportForm: (id: string): Promise<void> =>
    requests.download(`priceQuote/export/form/${id}`),
  printTicket: (): Promise<void> => requests.print(`priceQuote/ticket`),
  sendTestEmail: (requestId: string, email: string): Promise<void> =>
    requests.get(`priceQuote/email/${requestId}/${email}`),
  sendTestWhatsapp: (requestId: string, phone: string): Promise<void> =>
    requests.get(`priceQuote/whatsapp/${requestId}/${phone}`),
};

export default Quotation;
