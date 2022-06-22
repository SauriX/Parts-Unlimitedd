export interface IProceedingList{
    id:string,
    expediente:string,
    nomprePaciente:string,
    genero:string,
    edad:number,
    fechaNacimiento:Date,
    monederoElectronico:number,
    telefono:string,
}

export interface IProceedingForm{
    nombre:string,
    apellido:string,
    expediente:string,
    sexo:string,
    fechaNacimiento:Date,
    edad:number,
    edadCheck:boolean,
    telefono:string,
    correo:string,
    cp:string,
    estado:string,
    municipio:string,
    celular:string,
    calle:string,
    colonia:string
}