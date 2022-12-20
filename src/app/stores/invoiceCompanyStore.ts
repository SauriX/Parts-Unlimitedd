import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";
import InvoiceCompany from "../api/invoiceCompany";

export class InvoiceCompanyStore {
  constructor() {
    makeAutoObservable(this);
    // set: (newFormValues: IMassSearch) => {};
  }
  invoices: any = {};
  getInvoicesCompany = async (filter: any) => {
    try {
      const result = await InvoiceCompany.getInvoicesCompany(filter);
      this.invoices = result;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
