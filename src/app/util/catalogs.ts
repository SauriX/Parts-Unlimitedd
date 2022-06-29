import { IOptionsCatalog, IOptionsReport } from "../models/shared";

export const catalogs: IOptionsCatalog[] = [
  { value: "area", label: "Área", type: "area" },
  { value: "bank", label: "Banco", type: "normal" },
  { value: "clinic", label: "Clinica", type: "normal" },
  { value: "department", label: "Departamentos", type: "normal" },
  { value: "dimension", label: "Dimensiones", type: "dimension" },
  { value: "field", label: "Especialidad", type: "normal" },
  { value: "payment", label: "Forma de pago", type: "normal" },
  { value: "indicator", label: "Indicadores", type: "description" },
  { value: "workList", label: "Listas de trabajo", type: "normal" },
  { value: "delivery", label: "Paqueterias", type: "normal" },
  { value: "method", label: "Métodos", type: "normal" },
  { value: "paymentMethod", label: "Métodos de pago", type: "description" },
  { value: "sampleType", label: "Tipo de Muestra", type: "normal" },
  { value: "useOfCFDI", label: "Uso de CFDI", type: "description" },
];

export const reports: IOptionsReport[] = [
  { value: "expediente", label: "Expediente", type: "expediente" },
  { value: "prueba", label: "Prueba", type: "prueba" },
];
