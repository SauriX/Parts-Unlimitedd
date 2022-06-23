import moment from "moment";
export interface ISearch{
    expediente:string,
    telefono:string,
    fechaNacimiento:Date,
    fechaAlta:Date,
    ciudad:string,
    sucursal:string,
}
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
    id:string,
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
    colonia?:number
}

export class ProceedingFormValues implements IProceedingForm{

    id="";
    nombre="";
    apellido="";
    expediente="";
    sexo="";
    fechaNacimiento=new Date(moment.now());
    edad=0;
    edadCheck=false;
    telefono="";
    correo="";
    cp="";
    estado="";
    municipio="";
    celular="";
    calle="";
    colonia=undefined;
    constructor(init?:IProceedingForm) {
        Object.assign(this, init);
      }
}