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
    sucursal: string;
    fecha: moment.Moment;
    status: string;
    estudios: IstudyRoute[];

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
  }

  export class TrackingFormValues implements SearchTracking {
    fechas = [];
    buscar = "";
    sucursal = "";

    constructor(init?: SearchTracking) {
      Object.assign(this, init);
    }
    
  }