import { makeAutoObservable, toJS } from "mobx";

export default class InvoiceFreeStore {
  constructor() {
    makeAutoObservable(this);
  }

  receptor: any = {};
  setReceptor = (receptor: any) => {
    this.receptor = receptor;
  };

  receptorData: any = {};
  setReceptorData = (receptorData: any) => {
    this.receptorData = receptorData;
  };

  detailInvoice: any = [];
  setDetailInvoice = (detailInvoice: any) => {
    this.detailInvoice = detailInvoice;
  };

  tipoFacturaLibre: any = {};
  setTipoFacturaLibre = (tipoFacturaLibre: any) => {
    this.tipoFacturaLibre = tipoFacturaLibre;
  };

  totalDetailInvoiceFree: number = 0;
  setTotalDetailInvoiceFree = (totalDetail: number) => {
    this.totalDetailInvoiceFree = totalDetail;
  };

  isLoadingFree: boolean = false;
  setIsLoadingFree = (isLoadingFree: boolean) => {
    this.isLoadingFree = isLoadingFree;
  };
}
