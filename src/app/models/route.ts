export interface IRouteList {
    id: string;
    clave: string;
    nombre: string;
    sucursalOrigen: string;
    sucursalDestino: string;
    activo: boolean;
}

export interface IRouteForm {
    id: string,
    clave: string,
    nombre: string,
    sucursalOrigenId: string,
    sucursalDestinoId?:	string,
    maquiladorId?:	string|number,
    requierePaqueteria: boolean,
    seguimientoPaqueteria:	number,
    paqueteriaId: number,
    comentarios: string,
    diasDeEntrega: number,
    horaDeEntregaEstimada: number,
    horaDeEntrega:	number,
    horaDeRecoleccion?:	number,
    tiempoDeEntrega?:	number,
    formatoDeTiempoId?:	number,
    estudioId:	string,
    fechaInicial?: Date,
    fechaFinal?: Date,
    idResponsableEnvio:	string,
    idResponsableRecepcion:	string,
    activo: boolean
    estudio: IRouteEstudioList[],
    dias: IDias[],
    idArea:number,
    idDepartamento:number,

}

export interface IDias {
    id: number,
    dia: string,
}

export interface IRouteEstudioList {
    id: number,
    clave: string,
    nombre: string,
    area: string,
    departamento: string,
    activo: boolean,
    //selectedTags:IDias[],
}

export class RouteFormValues implements IRouteForm {
    id = "";
    clave = "";
    nombre = "";
    idListaPrecios = "";
    tipoDescuento = "";
    cantidadDescuento = 0;
    cantidad = 0;
    activo = true;
    sucursalOrigenId = "";
    sucursalDestinoId = undefined;
    maquiladorId = undefined;
    requierePaqueteria = false;
    seguimientoPaqueteria = 0;
    paqueteriaId = 0;
    comentarios = "";
    diasDeEntrega = 0;
    horaDeEntregaEstimada = 0;
    horaDeEntrega = 0;
    horaDeRecoleccion = undefined;
    tiempoDeEntrega = undefined;
    formatoDeTiempoId = 0;
    estudioId = "";
    idResponsableEnvio = "";
    idResponsableRecepcion = "";
    estudio: IRouteEstudioList[] = [];
    dias: IDias[] = [];
    idArea = 0;
    idDepartamento =0;

    constructor(init?: IRouteForm) {
        Object.assign(this, init);
    }
}