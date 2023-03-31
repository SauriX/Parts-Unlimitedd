import { IDias } from "../models/route";
import { IOptions, IOptionsCatalog, IOptionsReport } from "../models/shared";

export const catalogs: IOptionsCatalog[] = [
  { value: "area", label: "Áreas", type: "area" },
  { value: "bank", label: "Bancos", type: "normal" },
  { value: "clinic", label: "Clínicas", type: "normal" },
  { value: "department", label: "Departamentos", type: "normal" },
  // { value: "dimension", label: "Dimensiones", type: "dimension" },
  { value: "field", label: "Especialidades", type: "normal" },
  { value: "payment", label: "Formas de pago", type: "description" },
  { value: "indicator", label: "Indicadores", type: "description" },
  { value: "workList", label: "Listas de trabajo", type: "normal" },
  { value: "delivery", label: "Paqueterías", type: "normal" },
  { value: "method", label: "Métodos", type: "normal" },
  { value: "paymentMethod", label: "Métodos de pago", type: "normal" },
  { value: "sampleType", label: "Tipos de Muestra", type: "normal" },
  { value: "useOfCFDI", label: "Uso de CFDI", type: "description" },
  { value: "costofijo", label: "Serv. Costos Fijos", type: "costofijo" },
  {
    value: "invoiceconcepts",
    label: "Conceptos de facturas",
    type: "description",
  },
];

export const paymentForms = {
  tarjetaCredito: 4,
  tarjetaDebito: 18,
};

export const regimenFiscal: IOptions[] = [
  {
    value: "601",
    label: "601 General de Ley Personas Morales",
  },
  {
    value: "603",
    label: "603 Personas Morales con Fines no Lucrativos",
  },
  {
    value: "605",
    label: "605 Sueldos y Salarios e Ingresos Asimilados a Salarios",
  },
  { value: "606", label: "606 Arrendamiento" },
  { value: "607", label: "607 Régimen de Enajenación o Adquisición de Bienes" },
  { value: "608", label: "608 Demás ingresos" },
  { value: "609", label: "609 Consolidación" },
  {
    value: "610",
    label:
      "610 Residentes en el Extranjero sin Establecimiento Permanente en México",
  },
  {
    value: "611",
    label: "611 Ingresos por Dividendos (socios y accionistas)",
  },
  {
    value: "612",
    label: "612 Personas Físicas con Actividades Empresariales y Profesionales",
  },
  { value: "614", label: "614 Ingresos por intereses" },
  {
    value: "615",
    label: "615 Régimen de los ingresos por obtención de premios",
  },
  { value: "616", label: "616 Sin obligaciones fiscales" },
  {
    value: "620",
    label:
      "620 Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
  },
  { value: "621", label: "621 Incorporación Fiscal" },
  {
    value: "622",
    label: "622 Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
  },
  {
    value: "623",
    label: "623 Opcional para Grupos de Sociedades",
  },
  { value: "624", label: "624 Coordinados" },
  {
    value: "625",
    label:
      "625 Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  },
  { value: "626", label: "626 Régimen Simplificado de Confianza" },
  { value: "628", label: "628 Hidrocarburos" },
  {
    value: "629",
    label:
      "629 De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales",
  },
  {
    value: "630",
    label: "630 Enajenación de acciones en bolsa de valores",
  },
];

export const reports: IOptionsReport[] = [
  { value: "corte_caja", label: "Corte de caja", type: "corte_caja" },
  { value: "indicadores", label: "Indicadores", type: "indicadores" },
  { value: "expediente", label: "Expediente", type: "expediente" },
  { value: "estadistica", label: "Estadística Pacientes", type: "estadistica" },
  { value: "medicos", label: "Sol. Médico Condensado", type: "medicos" },
  {
    value: "medicos-desglosado",
    label: "Sol. Medicos Desglosado",
    type: "medicos-desglosado",
  },
  { value: "contacto", label: "Sol. Contacto", type: "contacto" },
  { value: "estudios", label: "Rel. Estudios por Paciente", type: "estudios" },
  { value: "urgentes", label: "Rel. Estudios Urgentes", type: "urgentes" },
  { value: "empresa", label: "Sol. Compañía", type: "empresa" },
  { value: "canceladas", label: "Sol. Canceladas", type: "canceladas" },
  { value: "cargo", label: "Sol. Cargo", type: "cargo" },
  {
    value: "presupuestos",
    label: "Presupuestos por Suc.",
    type: "presupuestos",
  },
  {
    value: "maquila_interna",
    label: "Sol. Maquila Int.",
    type: "maquila_interna",
  },
  {
    value: "maquila_externa",
    label: "Sol. Maquila Ext.",
    type: "maquila_externa",
  },
];

export const status = {
  request: {
    vigente: 1,
    completado: 2,
    cancelado: 3,
  },
  requestStudy: {
    pendiente: 1,
    tomaDeMuestra: 2,
    solicitado: 3,
    capturado: 4,
    validado: 5,
    liberado: 6,
    enviado: 7,
    enRuta: 8,
    cancelado: 9,
    entregado: 10,
    urgente: 11,
  },
  requestPayment: {
    pagado: 1,
    facturado: 2,
    cancelado: 3,
    facturaCancelada: 4,
  },
  quotation: {
    vigente: 1,
    vencido: 2,
    cancelado: 3,
  },
};

export const statusName = {
  requestStudy: {
    pendiente: "Pendiente",
    tomaDeMuestra: "Toma de muestra",
    solicitado: "Solicitado",
    capturado: "Capturado",
    validado: "Validado",
    liberado: "Liberado",
    enviado: "Enviado",
    enRuta: "En ruta",
    cancelado: "Cancelado",
    entregado: "Entregado",
    urgente: "Urgente",
  },
};

export const catalog = {
  urgency: {
    normal: 1,
    urgente: 2,
    urgenteCargo: 3,
  },
  origin: {
    convenio: 1,
    particular: 2,
  },
  area: {
    dop: 12,
    vdrl: 42,
  },
  company: {
    particulares: "1b84fa7e-9b41-41fa-b8e0-f1d029bb94d4",
  },
};

export const parameters = {
  valueType: {
    sinValor: "0",
    numerico: "1",
    numericoSexo: "2",
    numericoEdad: "3",
    numericoEdadSexo: "4",
    opcionMultiple: "5",
    unaColumna: "6",
    texto: "7",
    parrafo: "8",
    etiqueta: "9",
    observacion: "10",
    dosColumnas: "11",
    tresColumnas: "12",
    cuatroColumnas: "13",
    cincoColumnas: "14",
  },
};

export const daysOfWeek: IDias[] = [
  { id: 1, dia: "L" },
  { id: 2, dia: "M" },
  { id: 3, dia: "M" },
  { id: 4, dia: "J" },
  { id: 5, dia: "V" },
  { id: 6, dia: "S" },
  { id: 7, dia: "D" },
];
export type pickerType =
| "time"
| "date"
| "week"
| "month"
| "quarter"
| "year"
| undefined;

