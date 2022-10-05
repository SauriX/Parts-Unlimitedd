import moment from "moment";
export  interface shipmentStudy{
    id:string,
    estudio:string,
    paciente:string,
    solicitud:string,
    confirmacionOrigen:boolean,
    confirmacionDestino:boolean
}
export  interface shipmenttracking {
    id:string,
    sucursalOrigen:string,
    sucursalDestino:string,
    responsableOrigen:string,
    responsableDestino:string,
    medioentrega:string,
    fechaEnvio:moment.Moment,
    horaEnvio:moment.Moment,
    fechaEnestimada:moment.Moment,
    horaEnestimada:moment.Moment,
    fechaEnreal:moment.Moment,
    horaEnreal:moment.Moment,
    estudios:shipmentStudy[],
    seguimiento:string,
    ruta:string,
    nombre:string,
} 

