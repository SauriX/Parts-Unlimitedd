export interface ReportRequestInfo {
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
    estudios:StudyReportInfo[]
    estatus:string
}

export interface StudyReportInfo{
    idStudio:string
    nombre:string
    estatus:string
    fecha:string
}