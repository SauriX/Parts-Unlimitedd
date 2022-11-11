import { IOptionsCatalog, IOptionsReport } from "../models/shared";

export const catalogs: IOptionsCatalog[] = [
  { value: "area", label: "Áreas", type: "area" },
  { value: "bank", label: "Bancos", type: "normal" },
  { value: "clinic", label: "Clínicas", type: "normal" },
  { value: "department", label: "Departamentos", type: "normal" },
  { value: "dimension", label: "Dimensiones", type: "dimension" },
  { value: "field", label: "Especialidades", type: "normal" },
  { value: "payment", label: "Formas de pago", type: "normal" },
  { value: "indicator", label: "Indicadores", type: "description" },
  { value: "workList", label: "Listas de trabajo", type: "normal" },
  { value: "delivery", label: "Paqueterías", type: "normal" },
  { value: "method", label: "Métodos", type: "normal" },
  { value: "paymentMethod", label: "Métodos de pago", type: "description" },
  { value: "sampleType", label: "Tipos de Muestra", type: "normal" },
  { value: "useOfCFDI", label: "Uso de CFDI", type: "description" },
];

export const reports: IOptionsReport[] = [
  { value: "corte_caja", label: "Corte de caja", type: "corte_caja" },
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
  { value: "descuento", label: "Sol. Descuento", type: "descuento" },
  { value: "cargo", label: "Sol. Cargo", type: "cargo" },
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
