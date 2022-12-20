import requests from "./agent";

const InvoiceCompany = {
  getInvoicesCompany: (filter: any): Promise<any> =>
    requests.post("invoiceCompany/filter", filter),
};

export default InvoiceCompany;
