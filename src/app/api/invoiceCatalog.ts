
  import { IInvoiceCatalogFilter, IInvoiceList } from "../models/invoiceCatalog";
import { IScopes } from "../models/shared";

  import requests from "./agent";
  
  const InvoiceCatalog = {
    access: (): Promise<IScopes> => requests.get("scopes/medic"),
    getAll: (search: IInvoiceCatalogFilter): Promise<IInvoiceList[]> =>
      requests.post(`InvoiceCatalog`,search),
    exportList: (search: IInvoiceCatalogFilter): Promise<void> =>
      requests.download(`InvoiceCatalog/export/list`, search),
      printTicket: (
        recordId: string,
        requestId: string,
      ): Promise<void> =>
        requests.print(`request/ticket/${recordId}/${requestId}`),
        printInvoice: (
          recordId: string,
        ): Promise<void> =>
          requests.print(`invoice/print/pdf/${recordId}`),
  };
  export default InvoiceCatalog;