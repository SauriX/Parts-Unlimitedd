import moment from "moment"

export interface ISearchPending
{
    fecha:moment.Moment
    sucursal:string[]
    busqueda:string
    sucursaldest:string
}

export interface IReciveStudy
{
    id:string
    estudio:string
    solicitud:string
    horarecoleccion:moment.Moment
    check:moment.Moment
}

export interface IExtraStudy
{
    id:string
    clave:string
    estudio:string
    solicitud:string
    paciente:string
    escaneado:boolean
}
export interface  IStatus {
    created:boolean
    smpling:boolean
    route:boolean
    entregado:boolean
}
export interface IRecibe
{
    id:string
    nseguimiento:string
    claveroute:string
    sucursal:string
    fechaen:moment.Moment
    horaen:moment.Moment
    fechareal:moment.Moment
    study :IReciveStudy[]
    extra:IExtraStudy[]
    status:IStatus
}

export class searchValues implements ISearchPending {
    fecha=moment(moment.now());
    sucursal=[]
    busqueda=""
    sucursaldest=""
    constructor(init?: ISearchPending) {
      Object.assign(this, init);
    }
}