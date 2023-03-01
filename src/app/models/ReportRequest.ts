export interface IReportRequestInfo {
    expedienteId:string
    solicitudId:string
    solicitud:string
    paciente:string
    edad:string
    sexo:string
    sucursal:string
    medico:string
    tipo :string
    compañia:string
    entrega:string
    estudios:IStudyReportInfo[]
    estatus:string
}

export interface IStudyReportInfo{
    idStudio:string
    nombre:string
    estatus:string
    fecha:string
    color:string
}