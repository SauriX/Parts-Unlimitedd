export interface reportsoliInfo {
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
    estudios:studireportinfo[]
    estatus:string
}

export interface studireportinfo{
    idstudio:string
    estudioI:string
    estatus:string
    fechaentrega:string
}