import {
  IQuotation,
  IQuotationFilter,
  IQuotationGeneral,
  IQuotationInfo,
  IQuotationStudyUpdate,
  IQuotationTotal,
} from "../models/quotation";
import quotations from "./agent";

const Quotation = {
  getQuotations: (filter: IQuotationFilter): Promise<IQuotationInfo[]> =>
    quotations.post("quotation/filter", filter),
  getActive: (): Promise<IQuotationInfo[]> =>
    quotations.get("quotation/active"),
  getById: (quotationId: string): Promise<IQuotation> =>
    quotations.get(`quotation/${quotationId}`),
  getGeneral: (quotationId: string): Promise<IQuotationGeneral> =>
    quotations.get(`quotation/general/${quotationId}`),
  getStudies: (quotationId: string): Promise<IQuotationStudyUpdate> =>
    quotations.get(`quotation/studies/${quotationId}`),
  sendTestEmail: (quotationId: string, email: string): Promise<void> =>
    quotations.get(`quotation/email/${quotationId}/${email}`),
  sendTestWhatsapp: (quotationId: string, phone: string): Promise<void> =>
    quotations.get(`quotation/whatsapp/${quotationId}/${phone}`),
  create: (quotation: IQuotation): Promise<string> =>
    quotations.post("quotation", quotation),
  updateGeneral: (quotation: IQuotationGeneral): Promise<void> =>
    quotations.put("quotation/general", quotation),
  updateTotals: (quotation: IQuotationTotal): Promise<void> =>
    quotations.put("quotation/totals", quotation),
  updateStudies: (quotation: IQuotationStudyUpdate): Promise<void> =>
    quotations.post("quotation/studies", quotation),
  cancelQuotation: (quotationId: string): Promise<void> =>
    quotations.put(`quotation/cancel/${quotationId}`, {}),
  deleteStudies: (quotation: IQuotationStudyUpdate): Promise<void> =>
    quotations.put("quotation/studies/cancel", quotation),
  printTicket: (quotationId: string): Promise<void> =>
    quotations.print(`quotation/ticket/${quotationId}`),
};

export default Quotation;
