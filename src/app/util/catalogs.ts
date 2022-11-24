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

export const regimenFiscal: IOptionsCatalog[] = [
  { value: "601", label: "General de Ley Personas Morales", type: "description" },
  { value: "603", label: "Personas Morales con Fines no Lucrativos", type: "description" },
  { value: "605", label: "Sueldos y Salarios e Ingresos Asimilados a Salarios", type: "description" },
  { value: "606", label: "Arrendamiento", type: "description" },
  { value: "608", label: "Demás ingresos", type: "description" },
  { value: "609", label: "Consolidación", type: "description" },
  { value: "610", label: "Residentes en el Extranjero sin Establecimiento Permanente en México", type: "description" },
  { value: "611", label: "Ingresos por Dividendos (socios y accionistas)", type: "description" },
  { value: "612", label: "Personas Físicas con Actividades Empresariales y Profesionales", type: "description" },
  { value: "614", label: "Ingresos por intereses", type: "description" },
  { value: "616", label: "Sin obligaciones fiscales", type: "description" },
  { value: "620", label: "Sociedades Cooperativas de Producción que optan por diferir sus ingresos", type: "description" },
  { value: "621", label: "Incorporación Fiscal", type: "description" },
  { value: "622", label: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras", type: "description" },
  { value: "623", label: "Opcional para Grupos de Sociedades", type: "description" },
  { value: "624", label: "Coordinados", type: "description" },
  { value: "628", label: "Hidrocarburos", type: "description" },
  { value: "607", label: "Régimen de Enajenación o Adquisición de Bienes", type: "description" },
  { value: "629", label: "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales", type: "description" },
  { value: "630", label: "Enajenación de acciones en bolsa de valores", type: "description" },
  { value: "630", label: "Enajenación de acciones en bolsa de valores", type: "description" },
  { value: "615", label: "Régimen de los ingresos por obtención de premios", type: "description" },
  { value: "625", label: "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas", type: "description" },
  
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
