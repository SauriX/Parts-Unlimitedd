import requests from "./agent";

const InvoiceCompany = {
  getInvoicesCompany: (filter: any): Promise<any> =>
    requests.post("invoiceCompany/filter", filter),
  getConsecutiveBySerie: (serie: string): Promise<any> =>
    requests.get(`invoiceCompany/getConsecutiveBySerie/${serie}`),
  getInvoice: (id: string): Promise<any> =>
    requests.get(`invoiceCompany/${id}`),
  checkIn: (invoiceData: any): Promise<any> =>
    requests.post(`invoiceCompany/checkin/company`, invoiceData),
  sendInvoice: (sendInvoiceData: any): Promise<any> =>
    requests.post(`invoiceCompany/send`, sendInvoiceData),
  cancelInvoice: (cancelInvoiceData: any): Promise<any> =>
    requests.post(`invoiceCompany/cancel`, cancelInvoiceData),
  downloadPdf: (facturapiId: any): Promise<any> =>
    requests.download(`invoiceCompany/download/pdf/${facturapiId}`),
  printPdf: (facturapiId: any): Promise<any> =>
    requests.print(`invoiceCompany/print/pdf/${facturapiId}`),
  printReceipt: (receiptCompanyData: any): Promise<any> =>
    requests.print(`invoiceCompany/ticket`, receiptCompanyData),
};

export default InvoiceCompany;
