export interface ReportRequestInfo {
    expedienteId:string
    solicitudId:string
    solicitud:string
    paciente:string
    edad:string
    sexo:string
    sucursalorigin :string
    medico:string
    tipo :string
    compañia:string
    entrega:string
    estudios:StudyReportInfo[]
    estatus:string
}

export interface StudyReportInfo{
    idstudio:string
    estudioI:string
    estatus:string
    fechaentrega:string
}