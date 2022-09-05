import { IProceedingList } from "../models/Proceeding";
import { IPromotionForm, IPromotionList } from "../models/promotion";
import { IQuotationExpedienteSearch, IQuotationForm, IQuotationList, ISearchQuotation, ISolicitud } from "../models/quotation";
import { IRequestGeneral } from "../models/request";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Quotation = {
  access: (): Promise<IScopes> => requests.get("scopes/reagent"),
  getNow: (search:ISearchQuotation): Promise<IQuotationList[]> => requests.post(`PriceQuote/now`,search??{}),
  create: (promotion: IQuotationForm): Promise<boolean> => requests.post("/PriceQuote", promotion),
  getRecord: (search:IQuotationExpedienteSearch): Promise<IProceedingList[]> => requests.post(`PriceQuote/records`,search??{}),
  getById: (id: string): Promise<IQuotationForm> => requests.get(`PriceQuote/${id}`),
  update: (promotion:IQuotationForm): Promise<string> => requests.put("PriceQuote", promotion),
  createSolicitud: (promotion: ISolicitud ): Promise<string> => requests.post("/PriceQuote/solicitud", promotion),
  exportList: (search: ISearchQuotation): Promise<void> =>
  requests.download(`PriceQuote/export/list`, search),
  exportForm: (id: string): Promise<void> => requests.download(`PriceQuote/export/form/${id}`),
  printTicket: (): Promise<void> => requests.print(`PriceQuote/ticket`),
  sendTestEmail: ( requestId: string, email: string): Promise<void> =>
  requests.get(`PriceQuote/email/${requestId}/${email}`),
sendTestWhatsapp: ( requestId: string, phone: string): Promise<void> =>
  requests.get(`PriceQuote/whatsapp/${requestId}/${phone}`),
};

export default Quotation;
