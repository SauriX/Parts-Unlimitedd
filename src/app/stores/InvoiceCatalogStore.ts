import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
import history from "../util/history";
import { IInvoiceCatalogFilter, IInvoiceList, invoiceCatalogValues } from "../models/invoiceCatalog";
import InvoiceCatalog from "../../app/api/invoiceCatalog";

export default class InvoiceCatalogStore {
  constructor() {
    makeAutoObservable(this);
  }

  facturas: IInvoiceList[] = [];
  search: IInvoiceCatalogFilter = new invoiceCatalogValues();



  setSearch = (value: IInvoiceCatalogFilter) => {
    this.search = value;
  };

  getAll = async (search: IInvoiceCatalogFilter) => {
    try {
      const facturas = await InvoiceCatalog.getAll(search);
      this.facturas = facturas;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.facturas = [];
    }
  };

  exportList = async (search: IInvoiceCatalogFilter) => {
    try {
      await InvoiceCatalog.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  printTiket = async (expedienteId:string,solicitudId:string) => {
    try {
      await InvoiceCatalog.printTicket(expedienteId,solicitudId);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printInvoice = async (id:string) => {
    try {
      await InvoiceCatalog.printInvoice(id);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
