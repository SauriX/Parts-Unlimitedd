import {
  IInvoiceData,
  IInvoiceDeliveryInfo,
  IInvoiceFilter,
  IInvoicesFreeFilter,
  IMotivo,
  IReceiptData,
  IRequestsInvoices,
} from "./../models/Invoice";
import requests from "./agent";

const InvoiceCompany = {
  getInvoicesCompany: (filter: IInvoiceFilter): Promise<IRequestsInvoices> =>
    requests.post("invoiceCompany/filter", filter),
  getInvoicesFree: (filter: IInvoicesFreeFilter): Promise<any> =>
    requests.post("invoiceCompany/filter/free", filter),
  getConsecutiveBySerie: (serie: string): Promise<string> =>
    requests.get(`invoiceCompany/getConsecutiveBySerie/${serie}`),
  getInvoice: (id: string): Promise<IInvoiceData> =>
    requests.get(`invoiceCompany/${id}`),
  checkIn: (invoiceData: IInvoiceData): Promise<IInvoiceData> =>
    requests.post(`invoiceCompany/checkin/company`, invoiceData),
  checkInGlobal: (global: any): Promise<any> =>
    requests.post(`invoiceCompany/chekin/global`, global),
  sendInvoice: (sendInvoiceData: IInvoiceDeliveryInfo): Promise<boolean> =>
    requests.post(`invoiceCompany/send`, sendInvoiceData),
  cancelInvoice: (cancelInvoiceData: IMotivo): Promise<string> =>
    requests.post(`invoiceCompany/cancel`, cancelInvoiceData),
  downloadPdf: (facturapiId: string): Promise<any> =>
    requests.download(`invoiceCompany/download/pdf/${facturapiId}`),
  downloadXML: (facturapiId: string): Promise<any> =>
    requests.download(`invoiceCompany/print/xml/${facturapiId}`),
  printPdf: (facturapiId: string): Promise<any> =>
    requests.print(`invoiceCompany/print/pdf/${facturapiId}`),
  printReceipt: (receiptCompanyData: IReceiptData): Promise<any> =>
    requests.print(`invoiceCompany/ticket`, receiptCompanyData),
};

export default InvoiceCompany;
