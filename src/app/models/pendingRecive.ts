import moment from "moment"

export interface ISearch
{
    fecha:moment.Moment
    sucursal:string[]
    busqueda:string
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
    created:string
    smpling:string
    route:string
    entregado:string
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