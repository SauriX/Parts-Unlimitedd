import { makeAutoObservable } from "mobx";
import Invoice from "../api/invoice";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class InvoiceStore {
  constructor() {
    makeAutoObservable(this);
  }

  printXML = async (invoiceId: string) => {
    try {
      await Invoice.printXML(invoiceId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printPDF = async (invoiceId: string) => {
    try {
      await Invoice.printPDF(invoiceId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
