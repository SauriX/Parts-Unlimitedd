export interface IReportRequestInfo {
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
    estudios:IStudyReportInfo[]
    estatus:string
}

export interface IStudyReportInfo{
    idstudio:string
    estudioI:string
    estatus:string
    fechaentrega:string
}