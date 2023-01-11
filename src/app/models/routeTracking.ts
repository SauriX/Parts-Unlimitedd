import moment from "moment";

export interface SearchTracking{
        fechas: moment.Moment[];
        sucursal:string;
        buscar:string;
}

export interface IRouteList {
    id: string;
    seguimiento: string;
    clave: string;
    solicitud:string;
    Estudio:string;
    status: string;
    sucursal: string;
    fecha: string;
   
  }
  export interface IstudyRoute {
    id: number;
    nombre: string;
    area: string;
    status: number;
    registro: string;
    entrega: string;
    seleccion: boolean;
    clave: string;
    expedienteid:string;
    solicitudid:string;
    nombreEstatus:string
    routeId:string
  }

  export class TrackingFormValues implements SearchTracking {
    fechas = [moment(),moment()];
    buscar = "";
    sucursal = "";

    constructor(init?: SearchTracking) {
      Object.assign(this, init);
    }
    
  }