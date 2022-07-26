import { IColumns, ISearch } from "../../app/common/table/utils";
import { IReportData } from "../../app/models/report";
import getContactStatsColumns from "./columnDefinition/contactStats";
import getMedicalStatsColumns from "./columnDefinition/medicalStats";
import getPatientStatsColumns from "./columnDefinition/patientStats";
import getRequestByRecordColumns from "./columnDefinition/requestByRecord";

export const getInputs = (
  reportName: string
): ("sucursal" | "fecha" | "medico" | "metodoEnvio" | "compañia")[] => {
  const filters: ("sucursal" | "fecha" | "medico" | "metodoEnvio" | "compañia")[] = ["fecha", "sucursal"];

  if (reportName === "medicos") {
    filters.push("medico");
  }
  else if (reportName === "contacto") {
    filters.push("medico");
    filters.push("metodoEnvio");
  }

  return filters;
};

export const getReportConfig = (reportName: string): { title: string; image: string, hasFooterRow: boolean } => {
  let title = "";
  let image = "Reportes";
  let hasFooterRow = true;

  if (reportName === "expediente") {
    title = "Estadística de expedientes";
    hasFooterRow = false;
  } else if (reportName === "estadistica") {
    title = "Estadística de Pacientes";
  } else if (reportName === "medicos") {
    title = "Solicitudes por médico condensado";
    image = "doctor";
  } else if (reportName === "contacto") {
    title = "Solicitudes por contacto";
    image = "comunicar";
    hasFooterRow = false;
  }

  return { title, image, hasFooterRow };
};

export const getColumns = (
  reportName: string,
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
): IColumns<IReportData> => {
  if (reportName === "expediente") {
    return getRequestByRecordColumns(searchState, setSearchState);
  } else if (reportName === "estadistica") {
    return getPatientStatsColumns(searchState, setSearchState);
  } else if (reportName === "medicos") {
    return getMedicalStatsColumns(searchState, setSearchState);
  }
  else if (reportName === "contacto") {
    return getContactStatsColumns(searchState, setSearchState);
  }

  return [];
};
