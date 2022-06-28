import moment from "moment";
export interface ISearchQuotation{
    presupuesto:string,
    activo:boolean,
    telefono:string,
    fechaAlta:Date,
    ciudad:string,
    sucursal:string,
    email:string,
}
export interface IQuotationList{
    id:string,
    presupuesto:string,
    nomprePaciente:string,
    estudios:string,
    email:string,
    whatsapp:string,
    fecha:string,
    expediente:string,
    activo:boolean,
}

/* export interface IProceedingForm{
    id:string,
    nombre:string,
    apellido:string,
    expediente:string,
    sexo:string,
    fechaNacimiento?:Date,
    edad:number,
    edadCheck:boolean,
    telefono:string,
    correo:string,
    cp:string,
    estado:string,
    municipio:string,
    celular:string,
    calle:string,
    colonia?:number,
    colonian?:string,
    taxData?:ITaxForm[],
    sucursal?:string
} */

export class SearchQuotationValues implements ISearchQuotation{
    presupuesto = "";
    telefono = "";
    fechaAlta=new  Date(moment.now());
    ciudad= "";
    sucursal= "";
    activo = false;
    email="";
    constructor(init?:ISearchQuotation) {
        Object.assign(this, init);
    }
}

/* export class ProceedingFormValues implements IProceedingForm{

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
} */