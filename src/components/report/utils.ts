import { IColumns, ISearch } from "../../app/common/table/utils";
import { IReportData } from "../../app/models/report";
import getMedicalStatsColumns from "./columnDefinition/medicalStats";
import getPatientStatsColumns from "./columnDefinition/patientStats";
import getRequestByRecordColumns from "./columnDefinition/requestByRecord";

export const getInputs = (
  reportName: string
): ("sucursal" | "fecha" | "medico" | "metodoEnvio" | "compañia")[] => {
  const filters: ("sucursal" | "fecha" | "medico" | "metodoEnvio" | "compañia")[] = ["fecha", "sucursal"];

  if (reportName === "medicos" || reportName === "contacto") {
    filters.push("medico");
  }

  return filters;
};

export const getTitleAndImage = (reportName: string): { title: string; image: string } => {
  let title = "";
  let image = "Reportes";

  if (reportName === "expediente") {
    title = "Estadística de expedientes";
  } else if (reportName === "estadistica") {
    title = "Estadística de Pacientes";
  } else if (reportName === "medicos") {
    title = "Solicitudes por médico condensado";
    image = "doctor";
  }

  return { title, image };
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

  return [];
};
