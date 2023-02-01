import moment from "moment";

export interface IInvoiceCatalogFilter{
    fecha: moment.Moment[];
    sucursal:string[];
    buscar:string;
    tipo:string;
    ciudad:string[];
}

export interface IInvoiceList {
    id:string;
    clave:string;
    serie:string;
    tipo:string;
    descripcion?:string;
    fechaCreacion:string;
    solicitud:string;
    compañia:string;
    solicitudId:string
    expedienteId:string
    facturapiId:string
}


export class invoiceCatalogValues implements IInvoiceCatalogFilter {
        fecha = [moment(),moment()];
        sucursal = [];
        buscar = "";
        tipo= "";
        ciudad = [];
    constructor(init?: IInvoiceCatalogFilter) {
      Object.assign(this, init);
    }
  }