export  interface reciveStudy{
    id:string,
    estudio:string,
    paciente:string,
    solicitud:string,
    confirmacionOrigen:boolean,
    confirmacionDestino:boolean,
    temperatura:number
}

export  interface reciveTracking {
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
    estudios:reciveStudy[],
    seguimiento:string,
    ruta:string,
    nombre:string,
} 
