import { IReagentForm, IReagentList } from "../models/reagent";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Invoice = {
  printXML: (invoiceId: string): Promise<void> =>
    requests.download(`invoice/print/xml/${invoiceId}`),
  GetNextInvoiceSerieNumber: (serie: string): Promise<string> =>
    requests.get(`invoice/consecutive/${serie}`),
  printPDF: (invoiceId: string): Promise<void> =>
    requests.download(`invoice/print/pdf/${invoiceId}`),
};

export default Invoice;
