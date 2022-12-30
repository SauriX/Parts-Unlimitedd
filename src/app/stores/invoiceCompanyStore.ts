import { IOptions } from "./../models/shared";
import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";
import InvoiceCompany from "../api/invoiceCompany";
import Company from "../api/company";

export class InvoiceCompanyStore {
  constructor() {
    makeAutoObservable(this);
  }

  selectedRows: any[] = [];
  isSameCommpany: boolean = false;
  setSelectedRows = (rows: any[]) => {
    this.selectedRows = rows;
    this.isSameCommpany = !!rows.length
      ? this.selectedRows.every(
          (request) => request.compania === rows[0].compania
        )
      : false;
  };

  invoices: any = {};
  isLoading: boolean = false;
  getInvoicesCompany = async (filter: any) => {
    try {
      this.isLoading = true;
      const result = await InvoiceCompany.getInvoicesCompany(filter);
      this.invoices = result;
      this.isLoading = false;
    } catch (error: any) {
      this.isLoading = false;
      alerts.warning(getErrors(error));
    }
  };

  getCompanyById = async (id: string) => {
    try {
      const company = await Company.getById(id);
      return company;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  serie: string = "";
  setSerie = (serie: string) => {
    this.serie = serie;
    try {
      if (!!serie) {
        this.getConsecutive(serie);
      }
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  consecutiveBySerie: string = "";
  getConsecutive = async (serie: string) => {
    try {
      const consecutiveSerie = await InvoiceCompany.getConsecutiveBySerie(
        serie ?? this.serie
      );
      this.consecutiveBySerie = consecutiveSerie;
      return consecutiveSerie;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
