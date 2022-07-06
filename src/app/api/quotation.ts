import { IProceedingList } from "../models/Proceeding";
import { IPromotionForm, IPromotionList } from "../models/promotion";
import { IQuotationExpedienteSearch, IQuotationForm, IQuotationList, ISearchQuotation } from "../models/quotation";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Quotation = {
  access: (): Promise<IScopes> => requests.get("scopes/reagent"),
  getNow: (search:ISearchQuotation): Promise<IQuotationList[]> => requests.post(`PriceQuote/now`,search??{}),
  create: (promotion: IQuotationForm): Promise<boolean> => requests.post("/PriceQuote", promotion),
  getRecord: (search:IQuotationExpedienteSearch): Promise<IProceedingList[]> => requests.post(`PriceQuote/records`,search??{}),
  getById: (id: string): Promise<IQuotationForm> => requests.get(`PriceQuote/${id}`),
  update: (promotion: IQuotationForm): Promise<IQuotationForm> => requests.put("PriceQuote", promotion),

  getActive: (): Promise<IPromotionList[]> => requests.get(`promotion/active`),
  exportList: (search: string): Promise<void> =>
    requests.download(`promotion/export/list/${!search ? "all" : search}`),
  exportForm: (id: string): Promise<void> => requests.download(`promotion/export/form/${id}`),
};

export default Quotation;
