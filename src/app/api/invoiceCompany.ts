import requests from "./agent";

const InvoiceCompany = {
  getInvoicesCompany: (filter: any): Promise<any> =>
    requests.post("invoiceCompany/filter", filter),
  getConsecutiveBySerie: (serie: string): Promise<any> =>
    requests.get(`invoiceCompany/getConsecutiveBySerie/${serie}`),
  checkIn: (invoiceData: any): Promise<any> =>
    requests.post(`invoiceCompany/checkin`, invoiceData),
};

export default InvoiceCompany;
