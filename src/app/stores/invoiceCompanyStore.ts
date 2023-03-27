import { ITaxData } from "./../models/taxdata";
import { IOptions } from "./../models/shared";
import { makeAutoObservable, toJS } from "mobx";
import alerts from "../util/alerts";
import { getErrors } from "../util/utils";
import InvoiceCompany from "../api/invoiceCompany";
import Company from "../api/company";
import Invoice from "../api/invoice";
import { IInvoicesFreeFilter } from "../models/Invoice";

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

  selectedRequests: any[] = [];
  setSelectedRequests = (user: string) => {
    this.selectedRequests = this.selectedRows.filter(
      (x) => x.expedienteId === user
    );
  };
  detailInvoice: any = [];
  setDetailInvoice = (detailInvoice: any) => {
    this.detailInvoice = detailInvoice;
  };
  configurationInvoice: any = "";
  setConfigurationInvoice = (config: any) => {
    this.configurationInvoice = config;
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
  invoicesFree: any[] = [];
  getInvoicesFree = async (filter: IInvoicesFreeFilter) => {
    try {
      this.isLoading = true;
      const result = await InvoiceCompany.getInvoicesFree(filter);
      this.invoicesFree = result;
      this.isLoading = false;
    } catch (error: any) {
      this.isLoading = false;
      alerts.warning(getErrors(error));
    }
  };
  formValues: any = {};
  setFormValues = (filter: any) => {
    this.formValues = filter;
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
      const consecutiveSerie = await Invoice.GetNextInvoiceSerieNumber(
        serie ?? this.serie
      );
      this.consecutiveBySerie = consecutiveSerie;
      return consecutiveSerie;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  editInfo: boolean = false;
  changeEditInfo = () => {
    this.editInfo = !this.editInfo;
  };
  invoice: any = null;
  getInvoice = async (id: string) => {
    try {
      const invoiceData = await InvoiceCompany.getInvoice(id);
      this.invoice = invoiceData;
      return invoiceData;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  checkIn = async (invoiceData: any) => {
    try {
      const invoiceInfo = await InvoiceCompany.checkIn(invoiceData);
      return invoiceInfo;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  taxData: any = {};
  setTaxData = (data: ITaxData) => {
    this.taxData = data;
  };
  nombreSeleccionado: string = "";
  setNombreSeleccionado = (nombre: string) => {
    this.nombreSeleccionado = nombre;
  };
  downloadPdf = async (facturapiId: string) => {
    try {
      const invoiceInfo = await InvoiceCompany.downloadPdf(facturapiId);
      return invoiceInfo;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  downloadXML = async (facturapiId: string) => {
    try {
      const invoiceInfo = await InvoiceCompany.downloadXML(facturapiId);
      return invoiceInfo;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printPdf = async (facturapiId: string) => {
    try {
      const invoiceInfo = await InvoiceCompany.printPdf(facturapiId);
      return invoiceInfo;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  fechas: any[] = [];
  saveFilterDate = (fechas: any[]) => {
    this.fechas = fechas;
  };

  sendInvoice = async (sendInvoiceData: any) => {
    try {
      return await InvoiceCompany.sendInvoice(sendInvoiceData);
      // return invoiceInfo;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  cancelInvoice = async (cancelInvoiceData: any) => {
    try {
      return await InvoiceCompany.cancelInvoice(cancelInvoiceData);
      // return invoiceInfo;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printReceipt = async (receiptCompanyData: any) => {
    try {
      const reciptInfo = await InvoiceCompany.printReceipt(receiptCompanyData);
      return reciptInfo;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  selectedRequestGlobal: any[] = [];
  setSelectedRequestGlobal = async (selectedRequestGlobal: any[]) => {
    this.selectedRequestGlobal = selectedRequestGlobal;
  };

  isLoadingGlobal = false;
  createInvoiceGlobal = async (sucursalId: string) => {
    if (!this.selectedRequestGlobal.length) {
      alerts.info("Sin solicitudes seleccionadas");
      return;
    }
    try {
      alerts.info("Se estan generando las solicitudes");
      this.isLoadingGlobal = true;
      const response = await InvoiceCompany.checkInGlobal({
        sucursalId: sucursalId,
        solicitudesId: this.selectedRequestGlobal,
      });
      this.isLoadingGlobal = false;
      alerts.info("Facturas generadas correctamente");

      alerts.info("Se estan generando las solicitudes");
      return response;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
